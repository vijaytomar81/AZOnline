// src/frameworkCore/executionLayer/core/runner/types.ts

import type {
    ExecutionPlan,
    ExecutionScenario,
} from "@frameworkCore/executionLayer/contracts";
import type { ExecutorRegistry } from "@frameworkCore/executionLayer/core/registry";
import type { ExecutionItemDataRegistry } from "@frameworkCore/executionLayer/runtime/itemData";

export type RunScenariosArgs = ExecutionPlan & {
    registry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
    resolveOverrideItemData?: (
        scenario: ExecutionScenario
    ) => Record<string, unknown> | undefined;
    runId?: string;
    workerId?: string;
    evidenceOutputRoot?: string;
};

export type RunOutput = {
    status: "passed" | "failed";
    block: string;
    browser?: unknown;
};
