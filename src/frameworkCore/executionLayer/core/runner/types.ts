// src/frameworkCore/executionLayer/core/runner/types.ts

import type {
    ExecutionPlan,
    ExecutionScenario,
} from "@frameworkCore/executionLayer/contracts";
import type { ExecutorRegistry } from "@frameworkCore/executionLayer/core/registry";
import type { ExecutionItemDataRegistry } from "@frameworkCore/executionLayer/runtime/itemData";
import type { Platform } from "@configLayer/models/platform.config";
import type { Application } from "@configLayer/models/application.config";
import type { Product } from "@configLayer/models/product.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";

export type RunScenariosArgs = ExecutionPlan & {
    registry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
    resolveOverrideItemData?: (
        scenario: ExecutionScenario
    ) => Record<string, unknown> | undefined;
    runId?: string;
    workerId?: string;
    evidenceOutputRoot?: string;

    platform?: Platform;
    application?: Application;
    product?: Product;
    journeyContext?: JourneyContext;
};

export type RunOutput = {
    status: "passed" | "failed";
    block: string;
    browser?: unknown;
};
