// src/executionLayer/mode/e2e/scenario/normalize/normalizePolicyContext.ts

import type { ExecutionPolicyContext } from "@executionLayer/contracts";
import { normalizeKey } from "./shared";

export function normalizePolicyContext(
    value: unknown
): ExecutionPolicyContext {
    return normalizeKey(value) === "existingpolicy"
        ? "ExistingPolicy"
        : "NewBusiness";
}
