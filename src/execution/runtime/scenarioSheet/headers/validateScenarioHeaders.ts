// src/execution/runtime/scenarioSheet/headers/validateScenarioHeaders.ts

import { AppError } from "@utils/errors";
import { validateE2EPipelineTemplateHeaders } from "@execution/modes/e2e/scenario/e2EPipelineTemplateValidator";

export function validateScenarioHeaders(headers: string[]): void {
    const errors = validateE2EPipelineTemplateHeaders(headers);

    if (!errors.length) {
        return;
    }

    throw new AppError({
        code: "SCENARIO_HEADER_VALIDATION_FAILED",
        stage: "load-scenario-sheet",
        source: "headerUtils",
        message: `E2E pipeline sheet header validation failed\n${errors.join("\n")}`,
        context: {
            errorCount: errors.length,
        },
    });
}
