// src/frameworkCore/executionLayer/mode/e2e/scenario/validate/validateExecutionItemOrder.ts

import type { ExecutionItem } from "@frameworkCore/executionLayer/contracts";

export function validateExecutionItemOrder(
    items: ExecutionItem[]
): string[] {
    const errors: string[] = [];

    items.forEach((item, index) => {
        const expected = index + 1;

        if (item.itemNo !== expected) {
            errors.push(
                `Scenario items must be contiguous. Expected Item${expected} but found Item${item.itemNo}`
            );
        }
    });

    return errors;
}
