// src/execution/modes/e2e/scenario/template/validateTemplateRows.ts

import type { RawScenarioRow } from "../types";
import { getTemplateString } from "./shared";
import { validateTemplateRow } from "./validateTemplateRow";

export function validateTemplateRows(
    rows: RawScenarioRow[]
): Array<{ scenarioId: string; errors: string[] }> {
    return rows.map((row) => ({
        scenarioId: getTemplateString(row, "ScenarioId") || "(missing)",
        errors: validateTemplateRow(row),
    }));
}
