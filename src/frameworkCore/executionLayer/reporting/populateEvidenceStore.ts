// src/frameworkCore/executionLayer/reporting/populateEvidenceStore.ts

import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";

function setIfDefined(
    target: Record<string, unknown>,
    key: string,
    value: unknown
): void {
    if (value !== undefined && value !== null && value !== "") {
        target[key] = value;
    }
}

export function populateEvidenceStore(args: {
    evidenceContext: Record<string, unknown>;
    scenario: ExecutionScenario;
}): void {
    const { evidenceContext, scenario } = args;

    setIfDefined(evidenceContext, "scenarioId", scenario.scenarioId);
    setIfDefined(evidenceContext, "scenarioName", scenario.scenarioName);
    setIfDefined(evidenceContext, "platform", scenario.platform);
    setIfDefined(evidenceContext, "application", scenario.application);
    setIfDefined(evidenceContext, "product", scenario.product);
    setIfDefined(
        evidenceContext,
        "journeyStartWith",
        scenario.journeyStartWith
    );
    setIfDefined(evidenceContext, "policyNumber", scenario.policyNumber);
    setIfDefined(evidenceContext, "loginId", scenario.loginId);
    setIfDefined(evidenceContext, "description", scenario.description);
}
