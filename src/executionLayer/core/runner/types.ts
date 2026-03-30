// src/executionLayer/core/runner/types.ts

import type {
    ExecutionPlan,
    ExecutionScenario,
} from "@executionLayer/contracts";
import type { ExecutorRegistry } from "@executionLayer/core/registry";
import type { ExecutionItemDataRegistry } from "@executionLayer/runtime/itemData";

export type RunScenariosArgs = ExecutionPlan & {
    registry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
    resolveOverrideItemData?: (
        scenario: ExecutionScenario
    ) => Record<string, unknown> | undefined;
};

export type RunOutput = {
    status: "passed" | "failed";
    block: string;
};
