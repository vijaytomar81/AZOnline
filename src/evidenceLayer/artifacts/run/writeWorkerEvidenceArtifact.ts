// src/evidenceLayer/artifacts/run/writeWorkerEvidenceArtifact.ts

import fs from "node:fs/promises";
import path from "node:path";
import type { EvidenceContext } from "../../runtime/EvidenceContext";
import { EVIDENCE_OUTPUT_ROOT } from "@utils/paths";

export type WorkerEvidenceArtifact = {
    runId: string;
    workerId: string;
    testCaseId: string;
    retryIndex: number;
    writtenAt: string;
    caseEvidence: Record<string, unknown>;
};

export type WriteWorkerEvidenceArtifactInput = {
    context: EvidenceContext;
};

export type WriteWorkerEvidenceArtifactResult = {
    filePath: string;
};

function sanitizePathSegment(value: string): string {
    return value.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "unknown";
}

function buildRetrySuffix(retryIndex: number): string {
    return retryIndex > 0 ? `_retry-${retryIndex}` : "";
}

function buildWorkerArtifactPath(args: {
    runId: string;
    workerId: string;
    testCaseId: string;
    retryIndex: number;
    outputRoot?: string;
}): string {
    const outputRoot = args.outputRoot ?? EVIDENCE_OUTPUT_ROOT;
    const workerId = sanitizePathSegment(args.workerId);
    const testCaseId = sanitizePathSegment(args.testCaseId);
    const retrySuffix = buildRetrySuffix(args.retryIndex);
    const fileName = `${testCaseId}${retrySuffix}.json`;

    return path.join(
        outputRoot,
        sanitizePathSegment(args.runId),
        "worker-artifacts",
        workerId,
        fileName
    );
}

function buildWorkerEvidenceArtifact(
    input: WriteWorkerEvidenceArtifactInput
): WorkerEvidenceArtifact {
    const { runInfo, store } = input.context;

    return {
        runId: runInfo.runId,
        workerId: runInfo.workerId,
        testCaseId: runInfo.testCaseId,
        retryIndex: runInfo.retryIndex ?? 0,
        writtenAt: new Date().toISOString(),
        caseEvidence: store.snapshot(),
    };
}

async function writeJsonFile(
    filePath: string,
    content: unknown
): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

export async function writeWorkerEvidenceArtifact(
    input: WriteWorkerEvidenceArtifactInput
): Promise<WriteWorkerEvidenceArtifactResult> {
    const artifact = buildWorkerEvidenceArtifact(input);
    const outputRoot = input.context.runInfo.outputRoot ?? EVIDENCE_OUTPUT_ROOT;
    const filePath = buildWorkerArtifactPath({
        runId: artifact.runId,
        workerId: artifact.workerId,
        testCaseId: artifact.testCaseId,
        retryIndex: artifact.retryIndex,
        outputRoot,
    });

    await writeJsonFile(filePath, artifact);

    return { filePath };
}
