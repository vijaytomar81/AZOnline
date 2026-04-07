// src/executionLayer/core/scenario/runExecutionScenario.ts

import { writeScenarioEvidence } from "@frameworkCore/executionLayer/reporting";
import type {
    ExecutionScenario,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import type { ExecutorRegistry } from "@frameworkCore/executionLayer/core/registry";
import type { ExecutionItemDataRegistry } from "@frameworkCore/executionLayer/runtime/itemData";
import {
    attachBrowserSession,
    closeBrowserSession,
    createBrowserSession,
    type BrowserSession,
} from "@frameworkCore/executionLayer/core/browser";
import { buildScenarioExecutionResult } from "./buildScenarioExecutionResult";
import { createScenarioExecutionContext } from "./createScenarioExecutionContext";
import { runScenarioItems } from "./runScenarioItems";

export async function runExecutionScenario(args: {
    scenario: ExecutionScenario;
    registry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
    logScope: string;
    overrideItemData?: Record<string, unknown>;
    stopOnFailure?: boolean;
    runId?: string;
    workerId?: string;
    evidenceOutputRoot?: string;
}): Promise<ExecutionScenarioResult> {
    const context = createScenarioExecutionContext(args.scenario);
    let session: BrowserSession | undefined;

    try {
        session = await createBrowserSession();
        attachBrowserSession(context, session);

        await runScenarioItems({
            context,
            registry: args.registry,
            executionItemDataRegistry: args.executionItemDataRegistry,
            logScope: args.logScope,
            overrideItemData: args.overrideItemData,
            stopOnFailure: args.stopOnFailure,
        });
    } finally {
        await closeBrowserSession(session);
    }

    const result = buildScenarioExecutionResult(context);

    await writeScenarioEvidence({
        context,
        result,
        runId: args.runId ?? "local-run",
        workerId: args.workerId ?? "worker-0",
        outputRoot: args.evidenceOutputRoot,
    });

    return result;
}
