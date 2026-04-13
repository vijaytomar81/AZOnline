// src/frameworkCore/executionLayer/core/runner/types.ts

import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import type { ExecutorRegistry } from "@frameworkCore/executionLayer/core/registry";
import type { ExecutionItemDataRegistry } from "@frameworkCore/executionLayer/runtime/itemData";
import type { EvidenceFactory } from "@evidenceFactory";
import type { EnvKey } from "@configLayer/environments";

export type RunOutput = {
    status: "passed" | "failed" | "not_executed";
    block: string;
    browser?: unknown;
};

export type RunScenariosArgs = {
    mode: "data" | "e2e";
    environment: EnvKey;
    scenarios: ExecutionScenario[];
    iterations?: number;
    parallel?: number;
    verbose?: boolean;

    registry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
    resolveOverrideItemData?: (scenario: ExecutionScenario) => Record<string, unknown> | undefined;

    platform?: string;
    application?: string;
    product?: string;
    journeyContext?: unknown;

    schema?: string;
    source?: string;
    sheet?: string;

    runId?: string;
    workerId?: string;
    evidenceOutputRoot?: string;

    evidenceFactory?: EvidenceFactory;
    suiteName?: string;
};