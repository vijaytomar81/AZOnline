// src/execution/core/scenario/runScenario.ts

import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { ExecutorRegistry } from "@execution/core/registry";
import type { StepDataResolverRegistry } from "@execution/runtime/resolveStepData";
import {
    attachBrowserSession,
    closeBrowserSession,
    createBrowserSession,
} from "@execution/core/browserSession";
import type { ScenarioExecutionResult } from "@execution/core/result";
import { buildScenarioResultFromContext } from "./buildScenarioExecutionResult";
import { createScenarioExecutionContext } from "./createScenarioExecutionContext";
import { runScenarioSteps } from "./runScenarioSteps";

export async function runScenario(args: {
    scenario: ExecutionScenario;
    registry: ExecutorRegistry;
    dataRegistry: StepDataResolverRegistry;
    logScope: string;
    overrideStepData?: Record<string, unknown>;
    mode?: "data" | "e2e";
    stopOnFailure?: boolean;
}): Promise<ScenarioExecutionResult> {
    const context = createScenarioExecutionContext(args.scenario);
    const stopOnFailure = args.stopOnFailure !== false;
    let session;

    try {
        session = await createBrowserSession();
        attachBrowserSession(context, session);

        await runScenarioSteps({
            context,
            scenario: args.scenario,
            registry: args.registry,
            dataRegistry: args.dataRegistry,
            logScope: args.logScope,
            overrideStepData: args.overrideStepData,
            mode: args.mode,
            stopOnFailure,
        });
    } finally {
        await closeBrowserSession(session);
    }

    return buildScenarioResultFromContext(context);
}
