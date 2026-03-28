// src/execution/core/scenario/runScenarioSteps.ts

import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { ExecutionContext } from "@execution/core/context/executionContext.types";
import type { ExecutorRegistry } from "@execution/core/registry";
import type { StepDataResolverRegistry } from "@execution/runtime/resolveStepData";
import { runStep } from "@execution/core/step/runStep";

export async function runScenarioSteps(args: {
    context: ExecutionContext;
    scenario: ExecutionScenario;
    registry: ExecutorRegistry;
    dataRegistry: StepDataResolverRegistry;
    logScope: string;
    overrideStepData?: Record<string, unknown>;
    mode?: "data" | "e2e";
    stopOnFailure: boolean;
}): Promise<void> {
    for (const step of args.scenario.steps) {
        const result = await runStep({
            context: args.context,
            step,
            registry: args.registry,
            dataRegistry: args.dataRegistry,
            logScope: `${args.logScope}:Step${step.stepNo}`,
            overrideStepData: args.overrideStepData,
            mode: args.mode,
        });

        if (args.stopOnFailure && result.status === "failed") {
            break;
        }
    }
}
