// src/execution/modes/e2e/scenario/normalize/normalizeScenarioList.ts

import type { ExecutionScenario, RawScenarioRow } from "../types";
import { normalizeScenarioRow } from "./normalizeScenarioRow";

export function normalizeScenarioList(
    rows: RawScenarioRow[]
): ExecutionScenario[] {
    return rows.map(normalizeScenarioRow);
}
