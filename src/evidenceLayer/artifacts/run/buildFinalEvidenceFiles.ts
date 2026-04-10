// src/evidenceLayer/artifacts/run/buildFinalEvidenceFiles.ts
import type { RunEvidence } from "./buildRunEvidence";

export type FinalEvidenceCases = Record<string, Record<string, unknown>>;

export type FinalEvidenceFiles = {
    passedCases: FinalEvidenceCases;
    failedCases: FinalEvidenceCases;
    notExecutedCases: FinalEvidenceCases;
};

type ItemResult = Record<string, unknown>;
type ScenarioEvidence = Record<string, unknown>;

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function asItemResults(value: unknown): ItemResult[] {
    return Array.isArray(value)
        ? value.map((item) => asRecord(item))
        : [];
}

function asString(value: unknown): string {
    return String(value ?? "").trim().toLowerCase();
}

function summarizeScenario(itemResults: ItemResult[]) {
    let passedItems = 0;
    let failedItems = 0;
    let notExecutedItems = 0;

    itemResults.forEach((item) => {
        const status = asString(item.status);

        if (status === "passed") {
            passedItems += 1;
            return;
        }

        if (status === "not_executed") {
            notExecutedItems += 1;
            return;
        }

        failedItems += 1;
    });

    return {
        passedItems,
        failedItems,
        notExecutedItems,
    };
}

function buildScenarioErrorDetails(itemResults: ItemResult[]): string {
    const failedItem = itemResults.find(
        (item) => asString(item.status) === "failed"
    );

    if (!failedItem) {
        return "";
    }

    const details = asRecord(failedItem.details);
    const errorDetails = String(
        details.errorDetails ?? failedItem.message ?? ""
    ).trim();

    if (!errorDetails) {
        return "";
    }

    return `Scenario failed because item ${failedItem.itemNo} failed: ${errorDetails}`;
}

function compactItem(item: ItemResult): ItemResult {
    const details = asRecord(item.details);

    return {
        itemNo: item.itemNo,
        action: item.action,
        subType: details.subType ?? "",
        portal: details.portal ?? "",
        testCaseRef: details.testCaseRef ?? "",
        status: item.status,
        startedAt: item.startedAt,
        finishedAt: item.finishedAt,
        errorDetails: details.errorDetails ?? item.message ?? "",
        outputs: asRecord(details.outputs),
        pageScans: Array.isArray(details.pageScans) ? details.pageScans : [],
    };
}

function cloneScenarioBase(
    scenarioId: string,
    scenario: ScenarioEvidence,
    compactedItems: ItemResult[]
): ScenarioEvidence {
    return {
        scenarioId: scenario.scenarioId ?? scenarioId,
        scenarioName: scenario.scenarioName ?? "",
        platform: scenario.platform ?? "",
        application: scenario.application ?? "",
        product: scenario.product ?? "",
        journeyStartWith: scenario.journeyStartWith ?? "",
        policyNumber: scenario.policyNumber ?? "",
        loginId: scenario.loginId ?? "",
        description: scenario.description ?? "",
        totalItems: compactedItems.length,
        scenarioStatus: scenario.status ?? "",
        summary: summarizeScenario(compactedItems),
        errorDetails: buildScenarioErrorDetails(compactedItems),
        itemResults: [],
    };
}

function pushScenarioItem(
    bucket: FinalEvidenceCases,
    scenarioId: string,
    scenario: ScenarioEvidence,
    compactedItems: ItemResult[],
    item: ItemResult
): void {
    if (!bucket[scenarioId]) {
        bucket[scenarioId] = cloneScenarioBase(
            scenarioId,
            scenario,
            compactedItems
        );
    }

    const existingItems = asItemResults(bucket[scenarioId].itemResults);
    bucket[scenarioId].itemResults = [...existingItems, { ...item }];
}

function addItemToBucket(args: {
    scenarioId: string;
    scenario: ScenarioEvidence;
    compactedItems: ItemResult[];
    item: ItemResult;
    passedCases: FinalEvidenceCases;
    failedCases: FinalEvidenceCases;
    notExecutedCases: FinalEvidenceCases;
}): void {
    const status = asString(args.item.status);

    if (status === "passed") {
        pushScenarioItem(
            args.passedCases,
            args.scenarioId,
            args.scenario,
            args.compactedItems,
            args.item
        );
        return;
    }

    if (status === "not_executed") {
        pushScenarioItem(
            args.notExecutedCases,
            args.scenarioId,
            args.scenario,
            args.compactedItems,
            args.item
        );
        return;
    }

    pushScenarioItem(
        args.failedCases,
        args.scenarioId,
        args.scenario,
        args.compactedItems,
        args.item
    );
}

export function buildFinalEvidenceFiles(
    runEvidence: RunEvidence
): FinalEvidenceFiles {
    const passedCases: FinalEvidenceCases = {};
    const failedCases: FinalEvidenceCases = {};
    const notExecutedCases: FinalEvidenceCases = {};

    Object.entries(runEvidence.cases).forEach(([scenarioId, caseEvidence]) => {
        const scenario = asRecord(caseEvidence);
        const itemResults = asItemResults(scenario.itemResults);
        const compactedItems = itemResults.map(compactItem);

        compactedItems.forEach((item) =>
            addItemToBucket({
                scenarioId,
                scenario,
                compactedItems,
                item,
                passedCases,
                failedCases,
                notExecutedCases,
            })
        );
    });

    return {
        passedCases,
        failedCases,
        notExecutedCases,
    };
}