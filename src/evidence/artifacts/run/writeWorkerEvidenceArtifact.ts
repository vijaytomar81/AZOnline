// src/evidence/artifacts/run/writeWorkerEvidenceArtifact.ts

import fs from "node:fs/promises";
import path from "node:path";
import type { EvidenceContext } from "../../runtime/EvidenceContext";

export type WorkerEvidenceArtifact = {
    runId: string;
    workerId: string;
    cases: Record<string, Record<string, unknown>>;
};

export type WriteWorkerEvidenceArtifactInput = {
    context: EvidenceContext;
};

export type WriteWorkerEvidenceArtifactResult = {
    filePath: string;
};

function buildWorkerArtifactPath(
    runId: string,
    workerId: string,
    outputRoot = "results/evidence",
): string {
    return path.join(outputRoot, runId, "worker-artifacts", `${workerId}.json`);
}

function buildWorkerEvidenceArtifact(
    input: WriteWorkerEvidenceArtifactInput,
): WorkerEvidenceArtifact {
    const { runInfo, store } = input.context;

    return {
        runId: runInfo.runId,
        workerId: runInfo.workerId,
        cases: {
            [runInfo.testCaseId]: store.snapshot(),
        },
    };
}

async function writeJsonFile(
    filePath: string,
    content: unknown,
): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

export async function writeWorkerEvidenceArtifact(
    input: WriteWorkerEvidenceArtifactInput,
): Promise<WriteWorkerEvidenceArtifactResult> {
    const artifact = buildWorkerEvidenceArtifact(input);
    const outputRoot = input.context.runInfo.outputRoot ?? "results/evidence";
    const filePath = buildWorkerArtifactPath(
        artifact.runId,
        artifact.workerId,
        outputRoot,
    );

    let existing: WorkerEvidenceArtifact = {
        runId: artifact.runId,
        workerId: artifact.workerId,
        cases: {},
    };

    try {
        const raw = await fs.readFile(filePath, "utf8");
        existing = JSON.parse(raw) as WorkerEvidenceArtifact;
    } catch {
        existing = {
            runId: artifact.runId,
            workerId: artifact.workerId,
            cases: {},
        };
    }

    existing.cases[input.context.runInfo.testCaseId] =
        input.context.store.snapshot();

    await writeJsonFile(filePath, existing);

    return { filePath };
}