// src/frameworkCore/executionLayer/core/scenario/runExecutionScenario.ts

import type {
    ExecutionScenario,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import type { EnvKey } from "@configLayer/environments";
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
    environment: EnvKey;
    registry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
    logScope: string;
    overrideItemData?: Record<string, unknown>;
    stopOnFailure?: boolean;

    // ✅ NEW: EvidenceFactory integration
    evidenceFactory?: any;
    runId?: string;
    suiteName?: string;
    mode?: "e2e" | "data";
}): Promise<ExecutionScenarioResult> {
    const context = createScenarioExecutionContext(
        args.scenario,
        args.environment
    );
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

            // ✅ pass EvidenceFactory downstream
            evidenceFactory: args.evidenceFactory,
            runId: args.runId,
            suiteName: args.suiteName,
            mode: args.mode,
        });
    } finally {
        await closeBrowserSession(session);
    }

    const result = buildScenarioExecutionResult(context);

    return result;
}