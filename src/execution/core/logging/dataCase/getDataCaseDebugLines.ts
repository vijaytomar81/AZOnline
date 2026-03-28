// src/execution/core/logging/dataCase/getDataCaseDebugLines.ts

import type { StepExecutionResult } from "@execution/core/result";
import { safeText } from "@execution/core/logging/shared";

export function getDataCaseDebugLines(
    step?: StepExecutionResult
): string[] {
    const raw = step?.details?.debugLines;

    if (!Array.isArray(raw)) {
        return [];
    }

    return raw.map((item) => safeText(item).trim()).filter(Boolean);
}
