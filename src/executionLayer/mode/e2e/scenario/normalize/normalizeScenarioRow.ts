// src/executionLayer/mode/e2e/scenario/normalize/normalizeScenarioRow.ts

import type { ExecutionScenario } from "@executionLayer/contracts";
import type { RawExecutionScenarioRow } from "../types";
import { createExecutionItemsFromRow } from "./createExecutionItemsFromRow";
import { getTotalItems } from "./getTotalItems";
import { normalizeEntryPoint } from "./normalizeEntryPoint";
import { normalizeExecute } from "./normalizeExecute";
import { normalizePolicyContext } from "./normalizePolicyContext";
import { getString } from "./shared";

export function normalizeScenarioRow(
    row: RawExecutionScenarioRow
): ExecutionScenario {
    const totalItems = getTotalItems(row.TotalItems);

    return {
        scenarioId: getString(row.ScenarioId),
        scenarioName: getString(row.ScenarioName),
        journey: getString(row.Journey),
        policyContext: normalizePolicyContext(row.PolicyContext),
        entryPoint: normalizeEntryPoint(row),
        policyNumber: getString(row.PolicyNumber) || undefined,
        loginId: getString(row.LoginId) || undefined,
        password: getString(row.Password) || undefined,
        description: getString(row.Description),
        execute: normalizeExecute(row.Execute),
        totalItems,
        items: createExecutionItemsFromRow(row, totalItems),
    };
}
