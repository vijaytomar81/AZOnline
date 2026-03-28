// src/evidence/artifacts/run/buildRunEvidence.ts

export type RunEvidenceCaseMap = Record<string, Record<string, unknown>>;

export type RunEvidence = {
    runId: string;
    cases: RunEvidenceCaseMap;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneCaseEvidence(
    cases: Record<string, unknown>,
): RunEvidenceCaseMap {
    const result: RunEvidenceCaseMap = {};

    for (const [testCaseId, evidence] of Object.entries(cases)) {
        if (!isRecord(evidence)) {
            continue;
        }

        result[testCaseId] = { ...evidence };
    }

    return result;
}

export function buildRunEvidence(
    runId: string,
    cases: Record<string, unknown>,
): RunEvidence {
    return {
        runId,
        cases: cloneCaseEvidence(cases),
    };
}