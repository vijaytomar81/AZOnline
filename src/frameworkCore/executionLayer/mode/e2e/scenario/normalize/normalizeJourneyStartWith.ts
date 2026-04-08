// src/frameworkCore/executionLayer/mode/e2e/scenario/normalize/normalizeJourneyStartWith.ts

import type { ExecutionJourneyStartWith } from "@frameworkCore/executionLayer/contracts";
import { normalizeKey } from "./shared";

export function normalizeJourneyStartWith(args: {
    value: unknown;
    policyNumber?: string;
}): ExecutionJourneyStartWith {
    const normalized = normalizeKey(args.value);
    const hasPolicyNumber = String(args.policyNumber ?? "").trim().length > 0;

    if (
        normalized === "existingpolicy" ||
        normalized === "existing_policy" ||
        normalized === "existing"
    ) {
        return "existingPolicy";
    }

    if (
        normalized === "newpolicy" ||
        normalized === "new_policy" ||
        normalized === "new"
    ) {
        return "newPolicy";
    }

    return hasPolicyNumber ? "existingPolicy" : "newPolicy";
}
