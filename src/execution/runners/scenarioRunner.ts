// src/execution/runners/scenarioRunner.ts

import { createLogger, type Logger } from "../../utils/logger";
import type { ExecutionScenario } from "../scenario/types";
import {
    buildScenarioExecutionResult,
    type ScenarioExecutionResult,
} from "../runtime/result";
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

    log.info(
        `Scenario start -> id=${args.scenario.scenarioId}, journey=${args.scenario.journey}, ` +
        `startFrom=${args.scenario.startFrom}, totalSteps=${args.scenario.totalSteps}`
    );
    log.debug(
        `Scenario details -> execute=${args.scenario.execute}, ` +
        `policyNumber=${args.scenario.policyNumber ?? ""}, ` +
        `description=${args.scenario.description}`
    );

    for (const step of args.scenario.steps) {
        log.info(
            `Running Step${step.stepNo} -> action=${step.action}, ` +
            `portal=${step.portal}, testCaseId=${step.testCaseId}`
        );
        log.debug(
            `Step details -> subType=${step.subType ?? ""}, journey=${args.scenario.journey}`
        );

        const result = await runStep({
            context,
            step,
            registry: args.registry,
            dataRegistry: args.dataRegistry,
            log: log.child(`step${step.stepNo}`),
        });

        log.info(
            `Step${step.stepNo} finished -> status=${result.status}` +
            (result.message ? `, message=${result.message}` : "")
        );

        if (shouldStop(stopOnFailure, context)) {
            log.warn(`Scenario stopped after failed step.`);
            break;
        }
    }

    const result = buildScenarioExecutionResult({
        scenarioId: args.scenario.scenarioId,
        stepResults: context.stepResults,
    });

    log.info(`Scenario finished -> status=${result.status}`);
    log.debug(
        `Scenario outputs -> currentPolicyNumber=${context.currentPolicyNumber ?? ""}, ` +
        `currentQuoteNumber=${context.currentQuoteNumber ?? ""}, ` +
        `stepResults=${context.stepResults.length}`
    );

    return result;
}