// src/evidence/artifacts/json/buildEvidenceMetadata.ts

import type { EvidenceContext } from "../../runtime/EvidenceContext";

export type EvidenceExecutionStatus =
    | "passed"
    | "failed"
    | "skipped"
    | "timed_out"
    | "unknown";

export type BuildEvidenceMetadataInput = {
    status?: EvidenceExecutionStatus;
    startedAt?: string;
    finishedAt?: string;
};

export function buildEvidenceMetadata(
    context: EvidenceContext,
    input: BuildEvidenceMetadataInput = {},
): Record<string, unknown> {
    const { runInfo } = context;

    return {
        runId: runInfo.runId,
        workerId: runInfo.workerId,
        testCaseId: runInfo.testCaseId,
        retryIndex: runInfo.retryIndex ?? null,
        suiteName: runInfo.suiteName ?? null,
        status: input.status ?? "unknown",
        startedAt: input.startedAt ?? null,
        finishedAt: input.finishedAt ?? null,
    };
}