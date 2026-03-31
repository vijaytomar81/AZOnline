// src/executionLayer/logging/e2eScenario/getExecutionItemDebugLines.ts

import type { ExecutionItemResult } from "@executionLayer/contracts";
import { safeText } from "@executionLayer/logging/shared";

export function getExecutionItemDebugLines(
    item: ExecutionItemResult
): string[] {
    const raw = item.details?.debugLines;

    if (!Array.isArray(raw)) {
        return [];
    }

    return raw.map((entry) => safeText(entry).trim()).filter(Boolean);
}
