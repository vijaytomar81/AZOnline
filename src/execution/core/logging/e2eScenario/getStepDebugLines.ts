// src/execution/core/logging/e2eScenario/getStepDebugLines.ts

import type { StepExecutionResult } from "@execution/core/result";
import { safeText } from "@execution/core/logging/shared";

export function getStepDebugLines(step: StepExecutionResult): string[] {
    const raw = step.details?.debugLines;

    if (!Array.isArray(raw)) {
        return [];
    }

    return raw.map((item) => safeText(item).trim()).filter(Boolean);
}
