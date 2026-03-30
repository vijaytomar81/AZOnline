// src/dataLayer/builder/core/schemaRuntime/types.ts

import type ExcelJS from "exceljs";

export type BuildOpts = {
    ws: ExcelJS.Worksheet;
    col: number;
    rowIndex: Map<string, number>;
    includeEmpty: boolean;
};

export function isLeaf(node: unknown): node is Record<string, string> {
    return (
        !!node &&
        typeof node === "object" &&
        Object.values(node as Record<string, unknown>).every(
            (v) => typeof v === "string"
        )
    );
}