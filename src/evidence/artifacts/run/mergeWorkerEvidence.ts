// src/evidence/artifacts/run/mergeWorkerEvidence.ts

import fs from "node:fs/promises";
import path from "node:path";
import { buildRunEvidence, type RunEvidence } from "./buildRunEvidence";

type WorkerEvidenceArtifact = {
    runId: string;
    workerId: string;
    cases: Record<string, Record<string, unknown>>;
};

export type MergeWorkerEvidenceInput = {
    runId: string;
    outputRoot?: string;
    cleanupWorkerArtifacts?: boolean;
};

export type MergeWorkerEvidenceResult = {
    evidencePath: string;
    metadataPath: string;
    runEvidence: RunEvidence;
};

function buildRunPaths(runId: string, outputRoot = "results/evidence") {
    const baseDir = path.join(outputRoot, runId);

    return {
        baseDir,
        workerArtifactsDir: path.join(baseDir, "worker-artifacts"),
        evidencePath: path.join(baseDir, "evidence.json"),
        metadataPath: path.join(baseDir, "metadata.json"),
    };
}

async function readWorkerArtifacts(
    directoryPath: string,
): Promise<WorkerEvidenceArtifact[]> {
    let files: string[] = [];

    try {
        files = await fs.readdir(directoryPath);
    } catch {
        return [];
    }

    const jsonFiles = files.filter((file) => file.endsWith(".json")).sort();
    const artifacts: WorkerEvidenceArtifact[] = [];

    for (const fileName of jsonFiles) {
        const filePath = path.join(directoryPath, fileName);
        const raw = await fs.readFile(filePath, "utf8");
        artifacts.push(JSON.parse(raw) as WorkerEvidenceArtifact);
    }

    return artifacts;
}

function mergeCases(
    artifacts: WorkerEvidenceArtifact[],
): Record<string, Record<string, unknown>> {
    const merged: Record<string, Record<string, unknown>> = {};

    for (const artifact of artifacts) {
        for (const [testCaseId, caseEvidence] of Object.entries(artifact.cases)) {
            merged[testCaseId] = { ...caseEvidence };
        }
    }

    return merged;
}

async function writeJsonFile(filePath: string, content: unknown): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

async function cleanupDirectory(directoryPath: string): Promise<void> {
    await fs.rm(directoryPath, { recursive: true, force: true });
}

export async function mergeWorkerEvidence(
    input: MergeWorkerEvidenceInput,
): Promise<MergeWorkerEvidenceResult> {
    const outputRoot = input.outputRoot ?? "results/evidence";
    const paths = buildRunPaths(input.runId, outputRoot);
    const artifacts = await readWorkerArtifacts(paths.workerArtifactsDir);
    const mergedCases = mergeCases(artifacts);
    const runEvidence = buildRunEvidence(input.runId, mergedCases);

    const metadata = {
        runId: input.runId,
        workerArtifactCount: artifacts.length,
        caseCount: Object.keys(runEvidence.cases).length,
        cleanupWorkerArtifacts: input.cleanupWorkerArtifacts ?? false,
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
    };
}