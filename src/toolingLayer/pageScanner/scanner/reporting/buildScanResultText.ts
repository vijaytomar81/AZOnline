// src/toolingLayer/pageScanner/scanner/reporting/buildScanResultText.ts

import { failure, success } from "@utils/cliFormat";
import type { ScanPageResult } from "./types";

export function buildScanResultText(result: ScanPageResult): string {
    return result.operation === "failed"
        ? failure("ERROR FOUND")
        : success("ALL GOOD");
}
