// src/evidence/artifacts/run/buildFinalEvidenceFiles.ts

import type { RunEvidence } from "./buildRunEvidence";

export type FinalEvidenceCases = Record<string, Record<string, unknown>>;

export type FinalEvidenceFiles = {
    passedCases: FinalEvidenceCases;
    failedCases: FinalEvidenceCases;
};

function getScenarioStatus(caseEvidence: Record<string, unknown>): string {
    return String(caseEvidence.scenarioStatus ?? "").trim().toLowerCase();
}

export function buildFinalEvidenceFiles(
    runEvidence: RunEvidence
): FinalEvidenceFiles {
    const passedCases: FinalEvidenceCases = {};
    const failedCases: FinalEvidenceCases = {};

    Object.entries(runEvidence.cases).forEach(([testCaseId, caseEvidence]) => {
        if (getScenarioStatus(caseEvidence) === "passed") {
            passedCases[testCaseId] = { ...caseEvidence };
            return;
        }

        failedCases[testCaseId] = { ...caseEvidence };
    });

    return {
        passedCases,
        failedCases,
    };
}
