// src/evidence/artifacts/run/finalizeRunEvidence.ts

import fs from "node:fs/promises";
import path from "node:path";
import { mergeWorkerEvidence } from "./mergeWorkerEvidence";
import { buildFinalEvidenceFiles } from "./buildFinalEvidenceFiles";

export type FinalizeRunEvidenceInput = {
    runId: string;
    outputRoot?: string;
    cleanupTemporaryArtifacts?: boolean;
    keepFailedEvidenceFileOnlyWhenNeeded?: boolean;
};

export type FinalizeRunEvidenceResult = {
    baseDir: string;
    metadataPath: string;
    passedEvidencePath: string;
    failedEvidencePath?: string;
    passedCount: number;
    failedCount: number;
    totalCount: number;
};

function buildFinalPaths(runId: string, outputRoot = "results/evidence") {
    const baseDir = path.join(outputRoot, runId);

    return {
        baseDir,
        metadataPath: path.join(baseDir, "metadata.json"),
        passedEvidencePath: path.join(baseDir, "passed-evidence.json"),
        failedEvidencePath: path.join(baseDir, "failed-evidence.json"),
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
            .filter((name) => /^worker-\d+$/.test(name) || name === "worker-artifacts")
            .map((name) => fs.rm(path.join(baseDir, name), { recursive: true, force: true }))
    );
}

export async function finalizeRunEvidence(
    input: FinalizeRunEvidenceInput
): Promise<FinalizeRunEvidenceResult> {
    const outputRoot = input.outputRoot ?? "results/evidence";
    const paths = buildFinalPaths(input.runId, outputRoot);

    const merged = await mergeWorkerEvidence({
        runId: input.runId,
        outputRoot,
        cleanupWorkerArtifacts: false,
    });

    const { passedCases, failedCases } = buildFinalEvidenceFiles(merged.runEvidence);

    const passedCount = Object.keys(passedCases).length;
    const failedCount = Object.keys(failedCases).length;
    const totalCount = passedCount + failedCount;

    await writeJsonFile(paths.passedEvidencePath, {
        runId: input.runId,
        cases: passedCases,
    });

    const shouldKeepFailedFile =
        input.keepFailedEvidenceFileOnlyWhenNeeded !== false;

    if (failedCount > 0 || !shouldKeepFailedFile) {
        await writeJsonFile(paths.failedEvidencePath, {
            runId: input.runId,
            cases: failedCases,
        });
    } else {
        await removeFileIfExists(paths.failedEvidencePath);
    }

    await writeJsonFile(paths.metadataPath, {
        runId: input.runId,
        totalCount,
        passedCount,
        failedCount,
    });

    await removeFileIfExists(path.join(paths.baseDir, "evidence.json"));

    if (input.cleanupTemporaryArtifacts !== false) {
        await cleanupTemporaryArtifacts(paths.baseDir);
    }

    return {
        baseDir: paths.baseDir,
        metadataPath: paths.metadataPath,
        passedEvidencePath: paths.passedEvidencePath,
        failedEvidencePath:
            failedCount > 0 || !shouldKeepFailedFile
                ? paths.failedEvidencePath
                : undefined,
        passedCount,
        failedCount,
        totalCount,
    };
}
