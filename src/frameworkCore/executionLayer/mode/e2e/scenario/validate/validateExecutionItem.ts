// src/executionLayer/mode/e2e/scenario/validate/validateExecutionItem.ts

import type { ExecutionItem } from "@frameworkCore/executionLayer/contracts";
import { normalizeValidationKey } from "./shared";
import { validateExecutionItemPortal } from "./validateExecutionItemPortal";

export function validateExecutionItem(
    item: ExecutionItem
): string[] {
    const errors: string[] = [];

    if (!item.action) {
        errors.push(`Item${item.itemNo}: Missing Action`);
    }

    if (!item.testCaseRef) {
        errors.push(`Item${item.itemNo}: Missing TestCaseRef`);
    }

    errors.push(...validateExecutionItemPortal(item));

    if (normalizeValidationKey(item.action) !== "newbusiness" && !item.subType) {
        errors.push(`Item${item.itemNo}: Missing SubType`);
    }

    return errors;
}
