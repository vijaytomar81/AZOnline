// src/execution/modes/e2e/core/ensureScenariosExist.ts

import { AppError } from "@utils/errors";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";

export function ensureScenariosExist(
    scenarios: ExecutionScenario[]
): void {
    if (scenarios.length) {
        return;
    }

    throw new AppError({
        code: "NO_SCENARIOS_SELECTED",
        stage: "scenario-selection",
        source: "e2eRunner",
        message: "No scenarios selected for execution.",
    });
}
