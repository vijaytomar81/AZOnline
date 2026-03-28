// src/execution/modes/e2e/scenario/normalize/createStepsFromRow.ts

import type { RawScenarioRow, ScenarioStep } from "../types";
import { createStepFromRow } from "./createStepFromRow";

export function createStepsFromRow(
    row: RawScenarioRow,
    totalSteps: number
): ScenarioStep[] {
    const steps: ScenarioStep[] = [];

    for (let stepNo = 1; stepNo <= totalSteps; stepNo++) {
        steps.push(createStepFromRow(row, stepNo));
    }

    return steps;
}
