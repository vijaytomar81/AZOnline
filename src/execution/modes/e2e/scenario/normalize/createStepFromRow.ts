// src/execution/modes/e2e/scenario/normalize/createStepFromRow.ts

import type { RawScenarioRow, ScenarioStep } from "../types";
import { getScenarioString } from "./shared";

function getStepField(
    row: RawScenarioRow,
    stepNo: number,
    suffix: string
): string {
    return getScenarioString(row[`Step${stepNo}${suffix}`]);
}

export function createStepFromRow(
    row: RawScenarioRow,
    stepNo: number
): ScenarioStep {
    return {
        stepNo,
        action: getStepField(row, stepNo, "Action"),
        subType: getStepField(row, stepNo, "SubType") || undefined,
        portal: getStepField(row, stepNo, "Portal"),
        testCaseId: getStepField(row, stepNo, "TestCaseId"),
    };
}
