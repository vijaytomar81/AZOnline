// src/executionLayer/mode/e2e/scenario/normalize/normalizeScenarioList.ts

import type { ExecutionScenario } from "@executionLayer/contracts";
import type { RawExecutionScenarioRow } from "../types";
import { normalizeScenarioRow } from "./normalizeScenarioRow";

export function normalizeScenarioList(
    rows: RawExecutionScenarioRow[]
): ExecutionScenario[] {
    return rows.map(normalizeScenarioRow);
}
