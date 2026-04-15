// src/frameworkCore/executionLayer/mode/e2e/ensureScenariosExist.ts

import { AppError } from "@utils/errors";
import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";

export function ensureScenariosExist(
    scenarios: ExecutionScenario[]
): void {
    if (scenarios.length) {
        return;
    }

    throw new AppError({
        code: "NO_SCENARIOS_SELECTED",
        stage: "scenario-selection",
        source: "ensureScenariosExist",
        message: "No scenarios selected for execution.",
    });
}
