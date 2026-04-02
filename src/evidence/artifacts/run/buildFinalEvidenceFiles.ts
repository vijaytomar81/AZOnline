// src/evidence/artifacts/run/buildFinalEvidenceFiles.ts

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

function cloneScenarioBase(
    scenarioId: string,
    scenario: ScenarioEvidence
): ScenarioEvidence {
    const cloned = { ...scenario };
    cloned.scenarioId = scenario.scenarioId ?? scenarioId;
    cloned.itemResults = [];
    return cloned;
}

function pushScenarioItem(
    bucket: FinalEvidenceCases,
    scenarioId: string,
    scenario: ScenarioEvidence,
    item: ItemResult
): void {
    if (!bucket[scenarioId]) {
        bucket[scenarioId] = cloneScenarioBase(scenarioId, scenario);
    }

    const existingItems = asItemResults(bucket[scenarioId].itemResults);
    bucket[scenarioId].itemResults = [...existingItems, { ...item }];
}

function addItemToBucket(args: {
    scenarioId: string;
    scenario: ScenarioEvidence;
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
            args.item
        );
        return;
    }

    if (status === "not_executed") {
        pushScenarioItem(
            args.notExecutedCases,
            args.scenarioId,
            args.scenario,
            args.item
        );
        return;
    }

    pushScenarioItem(
        args.failedCases,
        args.scenarioId,
        args.scenario,
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

        itemResults.forEach((item) =>
            addItemToBucket({
                scenarioId,
                scenario,
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
