// src/executionLayer/reporting/populateEvidenceStore.ts

import type {
    ExecutionContext,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import type { EvidenceContext } from "@evidenceLayer";

type CompactItemResult = {
    itemNo: number;
    action: string;
    testCaseRef: string;
    status: string;
    startedAt: string;
    finishedAt: string;
    errorDetails: string;
    outputs: Record<string, unknown>;
    pageScans: string[];
};

function setIfDefined(
    context: EvidenceContext,
    label: string,
    value: unknown
): void {
    if (value !== undefined) {
        context.store.set(label, value);
    }
}

function asRecord(value: unknown): Record<string, unknown> {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
    }

    return {};
}

function asString(value: unknown): string {
    return String(value ?? "");
}

function getItemDetails(item: Record<string, unknown>): Record<string, unknown> {
    return asRecord(item.details);
}

function getItemTestCaseRef(item: Record<string, unknown>): string {
    const details = getItemDetails(item);
    return asString(details.testCaseRef);
}

function getItemOutputs(item: Record<string, unknown>): Record<string, unknown> {
    const details = getItemDetails(item);
    return asRecord(details.outputs);
}

function getItemErrorDetails(item: Record<string, unknown>): string {
    const details = getItemDetails(item);
    return asString(details.errorDetails || item.message);
}

function getItemPageScans(item: Record<string, unknown>): string[] {
    const details = getItemDetails(item);
    const scans = details.pageScans;

    if (!Array.isArray(scans)) {
        return [];
    }

    return scans.map((value) => String(value));
}

function buildCompactItemResults(
    result: ExecutionScenarioResult
): CompactItemResult[] {
    return result.itemResults.map((item) => {
        const raw = item as unknown as Record<string, unknown>;

        return {
            itemNo: Number(raw.itemNo ?? 0),
            action: asString(raw.action),
            testCaseRef: getItemTestCaseRef(raw),
            status: asString(raw.status),
            startedAt: asString(raw.startedAt),
            finishedAt: asString(raw.finishedAt),
            errorDetails: getItemErrorDetails(raw),
            outputs: getItemOutputs(raw),
            pageScans: getItemPageScans(raw),
        };
    });
}

function buildSummary(
    itemResults: CompactItemResult[]
): { passedItems: number; failedItems: number; notExecutedItems: number } {
    const passedItems = itemResults.filter(
        (item) => item.status.toLowerCase() === "passed"
    ).length;

    const failedItems = itemResults.filter(
        (item) => item.status.toLowerCase() === "failed"
    ).length;

    const notExecutedItems = itemResults.filter(
        (item) => item.status.toLowerCase() === "not_executed"
    ).length;

    return {
        passedItems,
        failedItems,
        notExecutedItems,
    };
}

function buildScenarioErrorDetails(
    itemResults: CompactItemResult[]
): string {
    const failedItem = itemResults.find(
        (item) => item.status.toLowerCase() === "failed"
    );

    if (!failedItem) {
        return "";
    }

    if (!failedItem.errorDetails) {
        return `Scenario failed because item ${failedItem.itemNo} failed.`;
    }

    return `Scenario failed because item ${failedItem.itemNo} failed: ${failedItem.errorDetails}`;
}

export function populateEvidenceStore(args: {
    evidenceContext: EvidenceContext;
    context: ExecutionContext;
    result: ExecutionScenarioResult;
}): void {
    const { evidenceContext, context, result } = args;
    const scenario = context.scenario;
    const itemResults = buildCompactItemResults(result);
    const summary = buildSummary(itemResults);
    const errorDetails =
        result.status.toLowerCase() === "failed"
            ? buildScenarioErrorDetails(itemResults)
            : "";

    setIfDefined(evidenceContext, "scenarioId", scenario.scenarioId);
    setIfDefined(evidenceContext, "scenarioName", scenario.scenarioName);
    setIfDefined(evidenceContext, "journey", scenario.journey);
    setIfDefined(evidenceContext, "policyContext", scenario.policyContext);
    setIfDefined(evidenceContext, "entryPoint", scenario.entryPoint ?? "Direct");
    setIfDefined(evidenceContext, "description", scenario.description);
    setIfDefined(evidenceContext, "totalItems", scenario.totalItems);
    setIfDefined(evidenceContext, "scenarioStatus", result.status);
    setIfDefined(evidenceContext, "summary", summary);
    setIfDefined(evidenceContext, "errorDetails", errorDetails);
    setIfDefined(evidenceContext, "itemResults", itemResults);
}
