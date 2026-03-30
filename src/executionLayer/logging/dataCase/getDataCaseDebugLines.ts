// src/executionLayer/logging/dataCase/getDataCaseDebugLines.ts

import type { ExecutionItemResult } from "@executionLayer/contracts";
import { safeText } from "@executionLayer/logging/shared";

export function getDataCaseDebugLines(
    item?: ExecutionItemResult
): string[] {
    const raw = item?.details?.debugLines;

    if (!Array.isArray(raw)) {
        return [];
    }

    return raw.map((entry) => safeText(entry).trim()).filter(Boolean);
}
