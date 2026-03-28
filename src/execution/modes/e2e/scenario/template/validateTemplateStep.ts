// src/execution/modes/e2e/scenario/template/validateTemplateStep.ts

import type { RawScenarioRow } from "../types";
import {
    getTemplateStepValue,
    normalizeTemplateKey,
} from "./shared";
import { validateTemplatePortal } from "./validateTemplatePortal";

export function validateTemplateStep(
    row: RawScenarioRow,
    stepNo: number
): string[] {
    const errors: string[] = [];
    const action = getTemplateStepValue(row, stepNo, "Action");
    const subType = getTemplateStepValue(row, stepNo, "SubType");
    const portal = getTemplateStepValue(row, stepNo, "Portal");
    const testCaseId = getTemplateStepValue(row, stepNo, "TestCaseId");

    if (!action) {
        errors.push(`Step${stepNo}: Action is required`);
    }

    errors.push(...validateTemplatePortal(stepNo, portal));

    if (!testCaseId) {
        errors.push(`Step${stepNo}: TestCaseId is required`);
    }

    if (normalizeTemplateKey(action) !== "newbusiness" && !subType) {
        errors.push(`Step${stepNo}: SubType is required for action ${action}`);
    }

    return errors;
}
