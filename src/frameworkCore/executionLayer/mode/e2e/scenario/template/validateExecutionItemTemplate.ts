// src/executionLayer/mode/e2e/scenario/template/validateExecutionItemTemplate.ts

import type { RawExecutionScenarioRow } from "../types";
import {
    getExecutionItemField,
    normalizeTemplateKey,
} from "./shared";
import { validateExecutionItemTemplatePortal } from "./validateExecutionItemTemplatePortal";

export function validateExecutionItemTemplate(
    row: RawExecutionScenarioRow,
    itemNo: number
): string[] {
    const errors: string[] = [];
    const action = getExecutionItemField(row, itemNo, "Action");
    const subType = getExecutionItemField(row, itemNo, "SubType");
    const portal = getExecutionItemField(row, itemNo, "Portal");
    const testCaseRef = getExecutionItemField(row, itemNo, "TestCaseRef");

    if (!action) {
        errors.push(`Item${itemNo}: Action is required`);
    }

    errors.push(...validateExecutionItemTemplatePortal(itemNo, portal));

    if (!testCaseRef) {
        errors.push(`Item${itemNo}: TestCaseRef is required`);
    }

    if (normalizeTemplateKey(action) !== "newbusiness" && !subType) {
        errors.push(`Item${itemNo}: SubType is required for action ${action}`);
    }

    return errors;
}
