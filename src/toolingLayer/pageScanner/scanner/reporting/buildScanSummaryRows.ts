// src/toolingLayer/pageScanner/scanner/reporting/buildScanSummaryRows.ts

import type { ScanPageResult, ScanSummaryRow } from "./types";

export function buildScanSummaryRows(
    result: ScanPageResult
): ScanSummaryRow[] {
    return [
        { label: "Operation", value: result.operation },
        { label: "Elements found", value: result.elementsFound },
        { label: "Added", value: result.diff.added.length },
        { label: "Updated", value: result.diff.updated.length },
        { label: "Removed", value: result.diff.removed.length },
        { label: "Unchanged", value: result.diff.unchanged.length },
        { label: "Exit code", value: result.operation === "failed" ? 1 : 0 },
    ];
}
