// src/evidenceLayer/artifacts/run/mergeWorkerEvidence.ts

import fs from "node:fs/promises";
import path from "node:path";
import { buildRunEvidence, type RunEvidence } from "./buildRunEvidence";
import { EVIDENCE_OUTPUT_ROOT } from "@utils/paths";

type WorkerEvidenceArtifact = {
    runId: string;
    workerId: string;
    testCaseId: string;
    retryIndex: number;
    writtenAt: string;
    caseEvidence: Record<string, unknown>;
};

export type MergeWorkerEvidenceInput = {
    runId: string;
    outputRoot?: string;
    cleanupWorkerArtifacts?: boolean;
};

export type MergeWorkerEvidenceMetadata = {
    runId: string;
    workerArtifactCount: number;
    mergedCaseCount: number;
    corruptedArtifactCount: number;
    duplicateCaseCount: number;
    cleanupWorkerArtifacts: boolean;
    finalizedAt: string;
};

export type MergeWorkerEvidenceResult = {
    evidencePath: string;
    metadataPath: string;
    runEvidence: RunEvidence;
    metadata: MergeWorkerEvidenceMetadata;
};

const DEFAULT_OUTPUT_ROOT = "results/evidence";

function buildRunPaths(runId: string, outputRoot = DEFAULT_OUTPUT_ROOT) {
    const baseDir = path.join(outputRoot, runId);

    return {
        baseDir,
        workerArtifactsDir: path.join(baseDir, "worker-artifacts"),
        evidencePath: path.join(baseDir, "evidence.json"),
        metadataPath: path.join(baseDir, "metadata.json"),
    };
}

async function collectJsonFiles(dirPath: string): Promise<string[]> {
    let entries: Array<import("node:fs").Dirent> = [];

    try {
        entries = await fs.readdir(dirPath, { withFileTypes: true });
    } catch {
        return [];
    }

    const nested = await Promise.all(
        entries.map(async (entry) => {
            const fullPath = path.join(dirPath, entry.name);

            if (entry.isDirectory()) {
                return collectJsonFiles(fullPath);
            }

            return entry.isFile() && entry.name.endsWith(".json")
                ? [fullPath]
                : [];
        })
    );

    return nested.flat().sort((a, b) => a.localeCompare(b));
}

async function readWorkerArtifacts(filePaths: string[]): Promise<{
    artifacts: WorkerEvidenceArtifact[];
    corruptedFiles: string[];
}> {
    const artifacts: WorkerEvidenceArtifact[] = [];
    const corruptedFiles: string[] = [];

    for (const filePath of filePaths) {
        try {
            const raw = await fs.readFile(filePath, "utf8");
            const parsed = JSON.parse(raw) as WorkerEvidenceArtifact;

            if (
                !parsed ||
                typeof parsed.runId !== "string" ||
                typeof parsed.testCaseId !== "string" ||
                typeof parsed.caseEvidence !== "object" ||
                parsed.caseEvidence === null
            ) {
                corruptedFiles.push(filePath);
                continue;
            }

            artifacts.push(parsed);
        } catch {
            corruptedFiles.push(filePath);
        }
    }

    return { artifacts, corruptedFiles };
}

function mergeCases(
    runId: string,
    artifacts: WorkerEvidenceArtifact[]
): {
    mergedCases: Record<string, Record<string, unknown>>;
    duplicateCaseCount: number;
} {
    const sortedArtifacts = [...artifacts].sort((a, b) => {
        if (a.testCaseId !== b.testCaseId) {
            return a.testCaseId.localeCompare(b.testCaseId);
        }

        if (a.retryIndex !== b.retryIndex) {
            return a.retryIndex - b.retryIndex;
        }

        return a.writtenAt.localeCompare(b.writtenAt);
    });

    const mergedCases: Record<string, Record<string, unknown>> = {};
    let duplicateCaseCount = 0;

    for (const artifact of sortedArtifacts) {
        if (artifact.runId !== runId) {
            continue;
        }

        if (mergedCases[artifact.testCaseId]) {
            duplicateCaseCount += 1;
        }

        mergedCases[artifact.testCaseId] = { ...artifact.caseEvidence };
    }

    return { mergedCases, duplicateCaseCount };
}

async function writeJsonFile(filePath: string, content: unknown): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

async function cleanupDirectory(directoryPath: string): Promise<void> {
    await fs.rm(directoryPath, { recursive: true, force: true });
}

export async function mergeWorkerEvidence(
    input: MergeWorkerEvidenceInput
): Promise<MergeWorkerEvidenceResult> {
    const outputRoot = input.outputRoot ?? EVIDENCE_OUTPUT_ROOT;
    const paths = buildRunPaths(input.runId, outputRoot);

    const workerArtifactFiles = await collectJsonFiles(paths.workerArtifactsDir);
    const { artifacts, corruptedFiles } = await readWorkerArtifacts(
        workerArtifactFiles
    );
    const { mergedCases, duplicateCaseCount } = mergeCases(input.runId, artifacts);
    const runEvidence = buildRunEvidence(input.runId, mergedCases);

    const metadata: MergeWorkerEvidenceMetadata = {
        runId: input.runId,
        workerArtifactCount: artifacts.length,
        mergedCaseCount: Object.keys(runEvidence.cases).length,
        corruptedArtifactCount: corruptedFiles.length,
        duplicateCaseCount,
        cleanupWorkerArtifacts: input.cleanupWorkerArtifacts ?? false,
        finalizedAt: new Date().toISOString(),
    };

    await writeJsonFile(paths.evidencePath, runEvidence);
    await writeJsonFile(paths.metadataPath, metadata);

    if (input.cleanupWorkerArtifacts) {
        await cleanupDirectory(paths.workerArtifactsDir);
    }

    return {
        evidencePath: paths.evidencePath,
        metadataPath: paths.metadataPath,
        runEvidence,
        metadata,
    };
}