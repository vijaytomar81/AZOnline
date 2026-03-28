// src/execution/modes/e2e/scenario/template/validateTemplateRow.ts

import type { RawScenarioRow } from "../types";
import { getTemplateTotalSteps } from "./shared";
import { validateBaseFields } from "./validateBaseFields";
import { validateTemplateStep } from "./validateTemplateStep";

export function validateTemplateRow(row: RawScenarioRow): string[] {
    const errors = validateBaseFields(row);
    const totalSteps = getTemplateTotalSteps(row);

    if (totalSteps <= 0) {
        return errors;
    }

    for (let stepNo = 1; stepNo <= totalSteps; stepNo++) {
        errors.push(...validateTemplateStep(row, stepNo));
    }

    return errors;
}
