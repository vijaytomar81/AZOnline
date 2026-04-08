// src/frameworkCore/executionLayer/reporting/writeScenarioEvidence.ts

import type {
    ExecutionContext,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import { populateEvidenceStore } from "./populateEvidenceStore";

export type WriteScenarioEvidenceArgs = {
    result: ExecutionScenarioResult;
    context: ExecutionContext;
    runId?: string;
    workerId?: string;
    outputRoot?: string;
};

export type WriteScenarioEvidenceResult = Record<string, unknown>;

export async function writeScenarioEvidence(
    args: WriteScenarioEvidenceArgs
): Promise<WriteScenarioEvidenceResult> {
    const evidenceContext: Record<string, unknown> = {};

    populateEvidenceStore({
        evidenceContext,
        scenario: args.context.scenario,
    });

    if (args.runId) {
        evidenceContext.runId = args.runId;
    }

    if (args.workerId) {
        evidenceContext.workerId = args.workerId;
    }

    if (args.outputRoot) {
        evidenceContext.outputRoot = args.outputRoot;
    }

    evidenceContext.resultStatus = args.result.status;
    evidenceContext.scenarioId = args.result.scenarioId;

    return evidenceContext;
}
