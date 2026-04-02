// src/evidence/artifacts/run/finalizeRunEvidence.ts

import fs from "node:fs/promises";
import path from "node:path";
import { mergeWorkerEvidence } from "./mergeWorkerEvidence";
import { buildFinalEvidenceFiles } from "./buildFinalEvidenceFiles";
import { promoteWorkerPageScans } from "./promoteWorkerPageScans";
import { writeExecutionEvidenceExcel } from "../excel/writeExecutionEvidenceExcel";
import { EVIDENCE_OUTPUT_ROOT } from "@utils/paths";

export type FinalizeRunEvidenceInput = {
    runId: string;
    outputRoot?: string;
    cleanupTemporaryArtifacts?: boolean;
    keepFailedEvidenceFileOnlyWhenNeeded?: boolean;
    metadata?: Record<string, unknown>;
};

export type FinalizeRunEvidenceResult = {
    baseDir: string;
    metadataPath: string;
    passedEvidencePath: string;
    failedEvidencePath?: string;
    notExecutedEvidencePath?: string;
    excelPath: string;
    passedCount: number;
    failedCount: number;
    notExecutedCount: number;
    totalCount: number;
};

type FinalEvidenceFile = {
    runId: string;
    cases: Record<string, Record<string, unknown>>;
};

function buildFinalPaths(runId: string, outputRoot = "results/evidence") {
    const baseDir = path.join(outputRoot, runId);

    return {
        baseDir,
        metadataPath: path.join(baseDir, "metadata.json"),
        passedEvidencePath: path.join(baseDir, "passed-evidence.json"),
        failedEvidencePath: path.join(baseDir, "failed-evidence.json"),
        notExecutedEvidencePath: path.join(baseDir, "not-executed-evidence.json"),
    };
}

async function writeJsonFile(filePath: string, content: unknown): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

async function removeFileIfExists(filePath: string): Promise<void> {
    await fs.rm(filePath, { force: true });
}

async function cleanupTemporaryArtifacts(baseDir: string): Promise<void> {
    let entries: string[] = [];

    try {
        entries = await fs.readdir(baseDir);
    } catch {
        return;
    }

    await Promise.all(
        entries
            .filter(
                (name) =>
                    name === "worker-artifacts" || /^worker-\d+$/.test(name)
            )
            .map((name) =>
                fs.rm(path.join(baseDir, name), {
                    recursive: true,
                    force: true,
                })
            )
    );
}

export async function finalizeRunEvidence(
    input: FinalizeRunEvidenceInput
): Promise<FinalizeRunEvidenceResult> {
    const outputRoot = input.outputRoot ?? EVIDENCE_OUTPUT_ROOT;
    const paths = buildFinalPaths(input.runId, outputRoot);

    const merged = await mergeWorkerEvidence({
        runId: input.runId,
        outputRoot,
        cleanupWorkerArtifacts: false,
    });

    const promotedPageScans = await promoteWorkerPageScans({
        runId: input.runId,
        outputRoot,
    });

    const { passedCases, failedCases, notExecutedCases } =
        buildFinalEvidenceFiles(merged.runEvidence);

    const passedCount = Object.keys(passedCases).length;
    const failedCount = Object.keys(failedCases).length;
    const notExecutedCount = Object.keys(notExecutedCases).length;
    const totalCount = passedCount + failedCount + notExecutedCount;

    const passedEvidence: FinalEvidenceFile = {
        runId: input.runId,
        cases: passedCases,
    };

    const failedEvidence: FinalEvidenceFile = {
        runId: input.runId,
        cases: failedCases,
    };

    const notExecutedEvidence: FinalEvidenceFile = {
        runId: input.runId,
        cases: notExecutedCases,
    };

    await writeJsonFile(paths.passedEvidencePath, passedEvidence);

    const keepFailedOnlyWhenNeeded =
        input.keepFailedEvidenceFileOnlyWhenNeeded !== false;

    if (failedCount > 0 || !keepFailedOnlyWhenNeeded) {
        await writeJsonFile(paths.failedEvidencePath, failedEvidence);
    } else {
        await removeFileIfExists(paths.failedEvidencePath);
    }

    if (notExecutedCount > 0) {
        await writeJsonFile(paths.notExecutedEvidencePath, notExecutedEvidence);
    } else {
        await removeFileIfExists(paths.notExecutedEvidencePath);
    }

    const metadata = {
        ...merged.metadata,
        ...input.metadata,
        outputRoot,
        totalCount,
        passedCount,
        failedCount,
        notExecutedCount,
        evidenceDir: paths.baseDir,
        passedEvidencePath: paths.passedEvidencePath,
        failedEvidencePath:
            failedCount > 0 || !keepFailedOnlyWhenNeeded
                ? paths.failedEvidencePath
                : "",
        notExecutedEvidencePath:
            notExecutedCount > 0 ? paths.notExecutedEvidencePath : "",
        pageScansDir: promotedPageScans.pageScansDir,
        promotedPageScanCount: promotedPageScans.promotedFileCount,
    };

    await writeJsonFile(paths.metadataPath, metadata);

    const excel = await writeExecutionEvidenceExcel({
        runId: input.runId,
        baseDir: paths.baseDir,
        metadata,
        passedEvidence,
        failedEvidence:
            failedCount > 0 || !keepFailedOnlyWhenNeeded
                ? failedEvidence
                : undefined,
        notExecutedEvidence:
            notExecutedCount > 0 ? notExecutedEvidence : undefined,
    });

    await removeFileIfExists(path.join(paths.baseDir, "evidence.json"));

    if (input.cleanupTemporaryArtifacts === true) {
        await cleanupTemporaryArtifacts(paths.baseDir);
    }

    return {
        baseDir: paths.baseDir,
        metadataPath: paths.metadataPath,
        passedEvidencePath: paths.passedEvidencePath,
        failedEvidencePath:
            failedCount > 0 || !keepFailedOnlyWhenNeeded
                ? paths.failedEvidencePath
                : undefined,
        notExecutedEvidencePath:
            notExecutedCount > 0 ? paths.notExecutedEvidencePath : undefined,
        excelPath: excel.filePath,
        passedCount,
        failedCount,
        notExecutedCount,
        totalCount,
    };
}
