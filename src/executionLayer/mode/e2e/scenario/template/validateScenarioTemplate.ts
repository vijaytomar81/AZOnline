// src/executionLayer/mode/e2e/scenario/template/validateScenarioTemplate.ts

import type { RawExecutionScenarioRow } from "../types";
import { getTemplateTotalItems } from "./shared";
import { validateBaseFields } from "./validateBaseFields";
import { validateExecutionItemTemplate } from "./validateExecutionItemTemplate";

export function validateScenarioTemplate(
    row: RawExecutionScenarioRow
): string[] {
    const errors = validateBaseFields(row);
    const totalItems = getTemplateTotalItems(row);

    if (totalItems <= 0) {
        return errors;
    }

    for (let itemNo = 1; itemNo <= totalItems; itemNo++) {
        errors.push(...validateExecutionItemTemplate(row, itemNo));
    }

    return errors;
}
