// src/executionLayer/mode/e2e/scenario/normalize/createExecutionItemsFromRow.ts

import type { ExecutionItem } from "@frameworkCore/executionLayer/contracts";
import type { RawExecutionScenarioRow } from "../types";
import { createExecutionItemFromRow } from "./createExecutionItemFromRow";

export function createExecutionItemsFromRow(
    row: RawExecutionScenarioRow,
    totalItems: number
): ExecutionItem[] {
    const items: ExecutionItem[] = [];

    for (let itemNo = 1; itemNo <= totalItems; itemNo++) {
        items.push(createExecutionItemFromRow(row, itemNo));
    }

    return items;
}
