// src/executionLayer/mode/e2e/scenario/normalize/normalizeExecute.ts

import { normalizeKey } from "./shared";

export function normalizeExecute(value: unknown): boolean {
    return normalizeKey(value) !== "n";
}
