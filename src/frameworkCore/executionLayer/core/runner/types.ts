// src/frameworkCore/executionLayer/core/runner/types.ts

import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import type { ExecutorRegistry } from "@frameworkCore/executionLayer/core/registry";
import type { ExecutionItemDataRegistry } from "@frameworkCore/executionLayer/runtime/itemData";
import type { EvidenceFactory } from "@evidenceFactory";

export type RunOutput = {
    status: "passed" | "failed" | "not_executed";
    block: string;
    browser?: unknown;
};

export type RunScenariosArgs = {
    // Core execution
    mode: "data" | "e2e";
    environment: string;
    scenarios: ExecutionScenario[];
    iterations?: number;
    parallel?: number;
    verbose?: boolean;

    // Execution infrastructure
    registry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
    resolveOverrideItemData?: (scenario: ExecutionScenario) => Record<string, unknown> | undefined;

    // Optional metadata (used in logs / headers)
    platform?: string;
    application?: string;
    product?: string;
    journeyContext?: unknown;

    // CLI / source context
    schema?: string;
    source?: string;
    sheet?: string;

    // Evidence / reporting
    runId?: string;
    workerId?: string;
    evidenceOutputRoot?: string;

    // ✅ NEW — EvidenceFactory integration
    evidenceFactory?: EvidenceFactory;
    suiteName?: string;
};