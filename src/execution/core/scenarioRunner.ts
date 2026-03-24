// src/execution/core/scenarioRunner.ts

import type { Logger } from "@utils/logger";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { ExecutorRegistry } from "@execution/core/registry";
import type { StepDataResolverRegistry } from "@execution/runtime/resolveStepData";
import {
    attachBrowserSession,
    closeBrowserSession,
    createBrowserSession,
} from "@execution/core/browserSession";
import {
    createExecutionContext,
} from "@execution/core/executionContext";
import {
    buildScenarioExecutionResult,
    type ScenarioExecutionResult,
} from "@execution/core/result";
import { runStep } from "@execution/core/stepRunner";

export async function runScenario(args: {
    scenario: ExecutionScenario;
    registry: ExecutorRegistry;
    dataRegistry: StepDataResolverRegistry;
    log: Logger;
    overrideStepData?: Record<string, unknown>;
    mode?: "data" | "e2e";
    stopOnFailure?: boolean;
}): Promise<ScenarioExecutionResult> {
    const context = createExecutionContext(args.scenario);
    const stopOnFailure = args.stopOnFailure !== false;
    let session;

    try {
        session = await createBrowserSession();
        attachBrowserSession(context, session);

        for (const step of args.scenario.steps) {
            const result = await runStep({
                context,
                step,
                registry: args.registry,
                dataRegistry: args.dataRegistry,
                log: args.log.child(`Step${step.stepNo}`),
                overrideStepData: args.overrideStepData,
                mode: args.mode,
            });

            if (stopOnFailure && result.status === "failed") {
                break;
            }
        }
    } finally {
        await closeBrowserSession(session);
    }

    return buildScenarioExecutionResult({
        scenarioId: args.scenario.scenarioId,
        stepResults: context.stepResults,
        outputs: context.outputs,
    });
}