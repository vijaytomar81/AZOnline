// src/execution/scenario/validator.ts

import type {
    ExecutionScenario,
    ScenarioStep,
    ScenarioValidationResult,
} from "./types";

function validateScenarioIdentity(scenario: ExecutionScenario): string[] {
    const errors: string[] = [];

    if (!scenario.scenarioId) errors.push("Missing ScenarioId");
    if (!scenario.scenarioName) errors.push("Missing ScenarioName");
    if (!scenario.journey) errors.push("Missing Journey");

    if (
        scenario.startFrom === "ExistingPolicy" &&
        !scenario.policyNumber
    ) {
        errors.push("PolicyNumber is required when StartFrom = ExistingPolicy");
    }

    return errors;
}

function validateStep(step: ScenarioStep): string[] {
    const errors: string[] = [];

    if (!step.action) {
        errors.push(`Step${step.stepNo}: Missing Action`);
    }

    return errors;
}

function validateStepOrder(steps: ScenarioStep[]): string[] {
    const errors: string[] = [];

    steps.forEach((step, index) => {
        const expectedStepNo = index + 1;
        if (step.stepNo !== expectedStepNo) {
            errors.push(
                `Scenario steps must be contiguous. Expected Step${expectedStepNo} but found Step${step.stepNo}`
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

    scenario.steps.forEach((step) => {
        errors.push(...validateStep(step));
    });

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