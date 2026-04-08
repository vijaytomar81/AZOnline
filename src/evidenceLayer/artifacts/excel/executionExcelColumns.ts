// src/evidenceLayer/artifacts/excel/executionExcelColumns.ts

import { OUTPUT_KEYS } from "@frameworkCore/executionLayer/constants/outputKeys";
import { flattenOutputKeys } from "./flattenOutputKeys";
import { prettifyExcelColumn } from "./prettifyExcelColumn";

export type ExecutionExcelColumn = {
    header: string;
    sourceKey: string;
    kind: "scenario" | "item" | "output";
};

const CORE_COLUMNS: ExecutionExcelColumn[] = [
    { header: "Scenario ID", sourceKey: "scenarioId", kind: "scenario" },
    { header: "Scenario Name", sourceKey: "scenarioName", kind: "scenario" },
    { header: "Journey", sourceKey: "journey", kind: "scenario" },
    { header: "Policy Context", sourceKey: "policyContext", kind: "scenario" },
    { header: "Entry Point", sourceKey: "entryPoint", kind: "scenario" },
    { header: "Scenario Status", sourceKey: "scenarioStatus", kind: "scenario" },
    { header: "Item No", sourceKey: "itemNo", kind: "item" },
    { header: "Action", sourceKey: "action", kind: "item" },
    { header: "Test Case Ref", sourceKey: "testCaseRef", kind: "item" },
    { header: "Item Status", sourceKey: "status", kind: "item" },
    { header: "Started At", sourceKey: "startedAt", kind: "item" },
    { header: "Finished At", sourceKey: "finishedAt", kind: "item" },
    { header: "Error Details", sourceKey: "errorDetails", kind: "item" },
];

const OUTPUT_COLUMNS: ExecutionExcelColumn[] = flattenOutputKeys(OUTPUT_KEYS).map(
    (item) => ({
        header: prettifyExcelColumn(item.columnName),
        sourceKey: item.outputKey,
        kind: "output" as const,
    })
);

function uniqueByHeader(
    columns: ExecutionExcelColumn[]
): ExecutionExcelColumn[] {
    const seen = new Set<string>();

    return columns.filter((column) => {
        if (seen.has(column.header)) {
            return false;
        }

        seen.add(column.header);
        return true;
    });
}

export const EXECUTION_EXCEL_COLUMNS: ExecutionExcelColumn[] = uniqueByHeader([
    ...CORE_COLUMNS,
    ...OUTPUT_COLUMNS,
]);
