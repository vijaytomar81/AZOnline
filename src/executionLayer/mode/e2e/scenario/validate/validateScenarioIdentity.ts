// src/executionLayer/mode/e2e/scenario/validate/validateScenarioIdentity.ts

import type { ExecutionScenario } from "@executionLayer/contracts";

export function validateScenarioIdentity(
    scenario: ExecutionScenario
): string[] {
    const errors: string[] = [];

    if (!scenario.scenarioId) {
        errors.push("Missing ScenarioId");
    }

    if (!scenario.scenarioName) {
        errors.push("Missing ScenarioName");
    }

    if (!scenario.journey) {
        errors.push("Missing Journey");
    }

    if (!scenario.description) {
        errors.push("Missing Description");
    }

    if (!scenario.totalItems || scenario.totalItems < 1) {
        errors.push("TotalItems must be greater than 0");
    }

    if (scenario.policyContext === "ExistingPolicy") {
        if (!scenario.policyNumber) {
            errors.push("Missing PolicyNumber");
        }

        if (!scenario.loginId) {
            errors.push("Missing LoginId");
        }

        if (!scenario.password) {
            errors.push("Missing Password");
        }
    }

    return errors;
}
