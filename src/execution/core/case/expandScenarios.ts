// src/execution/core/case/expandScenarios.ts

import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";

export function expandScenarios(
    scenarios: ExecutionScenario[],
    iterations: number
): ExecutionScenario[] {
    const runs: ExecutionScenario[] = [];

    for (let i = 1; i <= iterations; i++) {
        for (const scenario of scenarios) {
            runs.push(
                iterations > 1
                    ? { ...scenario, scenarioId: `${scenario.scenarioId}#ITER${i}` }
                    : scenario
            );
        }
    }

    return runs;
}
