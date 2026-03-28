// src/execution/modes/e2e/scenario/normalize/normalizeExecute.ts

import { normalizeScenarioKey } from "./shared";

export function normalizeExecute(value: unknown): boolean {
    return normalizeScenarioKey(value) !== "n";
}
