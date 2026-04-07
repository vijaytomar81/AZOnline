// src/executionLayer/mode/e2e/scenario/template/validateScenarioTemplates.ts

import type { RawExecutionScenarioRow, ScenarioValidationResult } from "../types";
import { getTemplateString } from "./shared";
import { validateScenarioTemplate } from "./validateScenarioTemplate";

export function validateScenarioTemplates(
    rows: RawExecutionScenarioRow[]
): ScenarioValidationResult[] {
    return rows.map((row) => ({
        scenarioId: getTemplateString(row, "ScenarioId") || "(missing)",
        errors: validateScenarioTemplate(row),
    }));
}
