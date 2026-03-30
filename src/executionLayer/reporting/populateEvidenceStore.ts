// src/executionLayer/reporting/populateEvidenceStore.ts

import type {
    ExecutionContext,
    ExecutionScenarioResult,
} from "@executionLayer/contracts";
import type { EvidenceContext } from "@/evidence";

function setIfDefined(
    context: EvidenceContext,
    label: string,
    value: unknown
): void {
    if (value !== undefined) {
        context.store.set(label, value);
    }
}

function buildItemResultsSummary(
    result: ExecutionScenarioResult
): Array<Record<string, unknown>> {
    return result.itemResults.map((item) => ({
        itemNo: item.itemNo,
        action: item.action,
        status: item.status,
        startedAt: item.startedAt,
        finishedAt: item.finishedAt,
        message: item.message ?? null,
        details: item.details ?? {},
    }));
}

export function populateEvidenceStore(args: {
    evidenceContext: EvidenceContext;
    context: ExecutionContext;
    result: ExecutionScenarioResult;
}): void {
    const { evidenceContext, context, result } = args;
    const scenario = context.scenario;

    setIfDefined(evidenceContext, "scenarioId", scenario.scenarioId);
    setIfDefined(evidenceContext, "scenarioName", scenario.scenarioName);
    setIfDefined(evidenceContext, "journey", scenario.journey);
    setIfDefined(evidenceContext, "policyContext", scenario.policyContext);
    setIfDefined(evidenceContext, "entryPoint", scenario.entryPoint ?? "Direct");
    setIfDefined(evidenceContext, "description", scenario.description);
    setIfDefined(evidenceContext, "totalItems", scenario.totalItems);
    setIfDefined(evidenceContext, "scenarioStatus", result.status);

    setIfDefined(
        evidenceContext,
        "itemResults",
        buildItemResultsSummary(result)
    );

    Object.entries(context.outputs).forEach(([key, value]) => {
        setIfDefined(evidenceContext, key, value);
    });
}
