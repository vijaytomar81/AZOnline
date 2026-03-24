// src/execution/runners/scenarioRunner.ts

import { createLogger, type Logger } from "../../utils/logger";
import type { ExecutionScenario } from "../scenario/types";
import {
    buildScenarioExecutionResult,
    type ScenarioExecutionResult,
} from "../runtime/result";
import {
    attachBrowserSession,
    closeBrowserSession,
    createBrowserSession,
} from "../runtime/browserSession";
import {
    createExecutionContext,
    type ExecutionContext,
} from "../runtime/executionContext";
import type { ExecutorRegistry } from "../runtime/registry";
import type { StepDataResolverRegistry } from "../runtime/resolveStepData";
import { runStep } from "./stepRunner";

export type RunScenarioArgs = {
    scenario: ExecutionScenario;
    registry: ExecutorRegistry;
    dataRegistry: StepDataResolverRegistry;
    log?: Logger;
    stopOnFailure?: boolean;
    overrideStepData?: Record<string, unknown>;
};

function createScenarioLogger(scenarioId: string, log?: Logger): Logger {
    return log ?? createLogger({ prefix: `[scenario:${scenarioId}]`, logLevel: "info" });
}

function shouldStop(stopOnFailure: boolean, context: ExecutionContext): boolean {
    if (!stopOnFailure) return false;
    return context.stepResults.some((item) => item.status === "failed");
}

export async function runScenario(
    args: RunScenarioArgs
): Promise<ScenarioExecutionResult> {
    const log = createScenarioLogger(args.scenario.scenarioId, args.log);
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
                log: log.child(`step${step.stepNo}`),
                overrideStepData: args.overrideStepData,
            });

            if (log) {
                log.info(
                    `Step${step.stepNo} finished -> status=${result.status}` +
                    (result.message ? `, message=${result.message}` : "")
                );
            }

            if (shouldStop(stopOnFailure, context)) {
                log.warn(`Scenario stopped after failed step.`);
                break;
            }
        }
    } finally {
        await closeBrowserSession(session);
    }

    return buildScenarioExecutionResult({
        scenarioId: args.scenario.scenarioId,
        stepResults: context.stepResults,
    });
}