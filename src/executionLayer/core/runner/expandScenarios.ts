// src/executionLayer/core/runner/expandScenarios.ts

import type { ExecutionScenario } from "@executionLayer/contracts";

export function expandScenarios(
    scenarios: ExecutionScenario[],
    iterations: number
): ExecutionScenario[] {
    const runs: ExecutionScenario[] = [];

    for (let i = 1; i <= iterations; i++) {
        for (const scenario of scenarios) {
            runs.push(
                iterations > 1
                    ? {
                        ...scenario,
                        scenarioId: `${scenario.scenarioId}#ITER${i}`,
                    }
                    : scenario
            );
        }
    }

    return runs;
}
