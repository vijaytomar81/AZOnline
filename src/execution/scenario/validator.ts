// src/execution/scenario/validator.ts

import type {
    ExecutionScenario,
    ScenarioStep,
    ScenarioValidationResult,
} from "./types";

function normalizeKey(value?: string): string {
    return String(value ?? "").trim().toLowerCase().replace(/\s+/g, "");
}

function validateScenarioIdentity(scenario: ExecutionScenario): string[] {
    const errors: string[] = [];

    if (!scenario.scenarioId) errors.push("Missing ScenarioId");
    if (!scenario.scenarioName) errors.push("Missing ScenarioName");
    if (!scenario.journey) errors.push("Missing Journey");
    if (!scenario.description) errors.push("Missing Description");
    if (!scenario.totalSteps || scenario.totalSteps < 1) {
        errors.push("TotalSteps must be greater than 0");
    }

    if (scenario.policyContext === "ExistingPolicy") {
        if (!scenario.policyNumber) errors.push("Missing PolicyNumber");
        if (!scenario.loginId) errors.push("Missing LoginId");
        if (!scenario.password) errors.push("Missing Password");
    }

    return errors;
}

function validatePortal(step: ScenarioStep): string[] {
    const portal = normalizeKey(step.portal);
    if (!portal) return [`Step${step.stepNo}: Missing Portal`];

    if (portal !== "customerportal" && portal !== "supportportal") {
        return [
            `Step${step.stepNo}: Portal must be CustomerPortal or SupportPortal`,
        ];
    }

    return [];
}

function validateStep(step: ScenarioStep): string[] {
    const errors: string[] = [];

    if (!step.action) errors.push(`Step${step.stepNo}: Missing Action`);
    if (!step.testCaseId) {
        errors.push(`Step${step.stepNo}: Missing TestCaseId`);
    }

    errors.push(...validatePortal(step));

    if (normalizeKey(step.action) !== "newbusiness" && !step.subType) {
        errors.push(`Step${step.stepNo}: Missing SubType`);
    }

    return errors;
}

function validateStepOrder(steps: ScenarioStep[]): string[] {
    const errors: string[] = [];

    steps.forEach((step, index) => {
        const expected = index + 1;
        if (step.stepNo !== expected) {
            errors.push(
                `Scenario steps must be contiguous. Expected Step${expected} but found Step${step.stepNo}`
            );
        }
    });

    return errors;
}

export function validateScenario(scenario: ExecutionScenario): string[] {
    const errors: string[] = [];

    errors.push(...validateScenarioIdentity(scenario));

    if (!scenario.steps.length) {
        errors.push("At least one step is required");
        return errors;
    }

    errors.push(...validateStepOrder(scenario.steps));
    scenario.steps.forEach((step) => errors.push(...validateStep(step)));

    return errors;
}

export function validateScenarios(
    scenarios: ExecutionScenario[]
): ScenarioValidationResult[] {
    return scenarios.map((scenario) => ({
        scenarioId: scenario.scenarioId || "(missing)",
        errors: validateScenario(scenario),
    }));
}