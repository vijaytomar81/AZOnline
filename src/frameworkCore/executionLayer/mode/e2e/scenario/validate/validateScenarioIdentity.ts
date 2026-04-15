// src/frameworkCore/executionLayer/mode/e2e/scenario/validate/validateScenarioIdentity.ts

import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";

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

    if (!scenario.platform) {
        errors.push("Missing Platform");
    }

    if (!scenario.application) {
        errors.push("Missing Application");
    }

    if (!scenario.product) {
        errors.push("Missing Product");
    }

    if (!scenario.journeyStartWith) {
        errors.push("Missing JourneyStartWith");
    }

    if (!scenario.description) {
        errors.push("Missing Description");
    }

    if (!scenario.totalItems || scenario.totalItems < 1) {
        errors.push("TotalItems must be greater than 0");
    }

    if (scenario.journeyStartWith === "existingPolicy") {
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
