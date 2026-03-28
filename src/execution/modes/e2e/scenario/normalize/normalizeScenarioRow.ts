// src/execution/modes/e2e/scenario/normalize/normalizeScenarioRow.ts

import type { ExecutionScenario, RawScenarioRow } from "../types";
import { createStepsFromRow } from "./createStepsFromRow";
import { getTotalSteps } from "./getTotalSteps";
import { normalizeEntryPoint } from "./normalizeEntryPoint";
import { normalizeExecute } from "./normalizeExecute";
import { normalizePolicyContext } from "./normalizePolicyContext";
import { getScenarioString } from "./shared";

export function normalizeScenarioRow(
    row: RawScenarioRow
): ExecutionScenario {
    const totalSteps = getTotalSteps(row.TotalSteps);

    return {
        scenarioId: getScenarioString(row.ScenarioId),
        scenarioName: getScenarioString(row.ScenarioName),
        journey: getScenarioString(row.Journey),
        policyContext: normalizePolicyContext(row.PolicyContext),
        entryPoint: normalizeEntryPoint(row),
        policyNumber: getScenarioString(row.PolicyNumber) || undefined,
        loginId: getScenarioString(row.LoginId) || undefined,
        password: getScenarioString(row.Password) || undefined,
        description: getScenarioString(row.Description),
        execute: normalizeExecute(row.Execute),
        totalSteps,
        steps: createStepsFromRow(row, totalSteps),
    };
}
