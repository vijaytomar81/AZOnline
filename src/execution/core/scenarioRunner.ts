// src/execution/core/scenarioRunner.ts

import { createLogger, type Logger } from "@utils/logger";
import { success, failure, warning, muted } from "@utils/cliFormat";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import {
    buildScenarioExecutionResult,
    type ScenarioExecutionResult,
} from "./result";
import {
    attachBrowserSession,
    closeBrowserSession,
    createBrowserSession,
} from "./browserSession";
import {
    createExecutionContext,
    type ExecutionContext,
} from "./executionContext";
import type { ExecutorRegistry } from "./registry";
import type { StepDataResolverRegistry } from "@execution/runtime/resolveStepData";
import { runStep } from "./stepRunner";

export type RunScenarioArgs = {
    scenario: ExecutionScenario;
    registry: ExecutorRegistry;
    dataRegistry: StepDataResolverRegistry;
    log?: Logger;
    stopOnFailure?: boolean;
    overrideStepData?: Record<string, unknown>;
};

function formatStatus(status: string): string {
    const s = status.toLowerCase();

    if (s === "passed") return success("passed");
    if (s === "failed") return failure("failed");
    if (s === "skipped") return warning("skipped");

    return status;
}

function createScenarioLogger(scenarioId: string, log?: Logger): Logger {
    return log ?? createLogger({ prefix: `[execution:${scenarioId}]`, logLevel: "info" });
}

function shouldStop(stopOnFailure: boolean, context: ExecutionContext): boolean {
    if (!stopOnFailure) return false;
    return context.stepResults.some((item: { status: string }) => item.status === "failed");
}

function printScenarioHeader(scenario: ExecutionScenario): void {
    const title = `[SCENARIO] ${scenario.scenarioId} | ${scenario.scenarioName}`;
    const line = "=".repeat(20);

    console.log("");
    console.log(`${line}${title}${line}`);
    console.log(`ScenarioId      : ${scenario.scenarioId}`);
    console.log(`ScenarioName    : ${scenario.scenarioName}`);
    console.log(`Journey         : ${scenario.journey}`);
    console.log(`PolicyContext   : ${scenario.policyContext}`);
    console.log(`EntryPoint      : ${scenario.entryPoint ?? "Direct"}`);
    console.log(`Total Steps     : ${scenario.totalSteps}`);
    console.log("");
}

function printStepHeader(stepNo: number, action: string, testCaseId: string): void {
    console.log("----------------------------------------");
    console.log(`[STEP ${stepNo}] ${action} | TestCaseId=${testCaseId}`);
    console.log("");
}

export async function runScenario(
    args: RunScenarioArgs
): Promise<ScenarioExecutionResult> {
    const log = createScenarioLogger(args.scenario.scenarioId, args.log);
    const context = createExecutionContext(args.scenario);
    const stopOnFailure = args.stopOnFailure !== false;
    let session;

    printScenarioHeader(args.scenario);

    try {
        session = await createBrowserSession();
        attachBrowserSession(context, session);

        for (const step of args.scenario.steps) {
            printStepHeader(step.stepNo, step.action, step.testCaseId);

            const result = await runStep({
                context,
                step,
                registry: args.registry,
                dataRegistry: args.dataRegistry,
                log: log.child(` Step ${step.stepNo}`),
                overrideStepData: args.overrideStepData,
            });

            log.info(
                `Step${step.stepNo} -> ${formatStatus(result.status)}` +
                (result.message ? ` | ${failure(result.message)}` : "")
            );

            // 👇 ADD THIS (important)
            console.log("----------------------------------------");

            if (shouldStop(stopOnFailure, context)) {
                log.warn("Scenario stopped after failed Step.");
                break;
            }
        }
    } finally {
        await closeBrowserSession(session);
    }

    // printScenarioFooter();

    return buildScenarioExecutionResult({
        scenarioId: args.scenario.scenarioId,
        stepResults: context.stepResults,
    });
}