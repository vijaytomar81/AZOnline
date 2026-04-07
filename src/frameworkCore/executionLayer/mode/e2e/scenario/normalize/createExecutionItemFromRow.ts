// src/executionLayer/mode/e2e/scenario/normalize/createExecutionItemFromRow.ts

import type { ExecutionItem } from "@frameworkCore/executionLayer/contracts";
import type { RawExecutionScenarioRow } from "../types";
import { getString } from "./shared";

function getItemField(
    row: RawExecutionScenarioRow,
    itemNo: number,
    suffix: string
): string {
    return getString(row[`Item${itemNo}${suffix}`]);
}

export function createExecutionItemFromRow(
    row: RawExecutionScenarioRow,
    itemNo: number
): ExecutionItem {
    return {
        itemNo,
        action: getItemField(row, itemNo, "Action"),
        subType: getItemField(row, itemNo, "SubType") || undefined,
        portal: getItemField(row, itemNo, "Portal") || undefined,
        testCaseRef: getItemField(row, itemNo, "TestCaseRef"),
    };
}
