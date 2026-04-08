// src/frameworkCore/executionLayer/reporting/buildEvidenceRunInfo.ts

import type {
    ExecutionContext,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import type { EvidenceRunInfo } from "@evidenceLayer";

export function buildEvidenceRunInfo(args: {
    context: ExecutionContext;
    result: ExecutionScenarioResult;
    runId: string;
    workerId?: string;
    outputRoot?: string;
    retryIndex?: number;
}): EvidenceRunInfo {
    return {
        runId: args.runId,
        workerId: args.workerId ?? "worker-0",
        testCaseId: args.context.scenario.scenarioId,
        suiteName: args.context.scenario.scenarioName,
        outputRoot: args.outputRoot,
        retryIndex: args.retryIndex,
    };
}
