// src/businessJourneys/shared/types.ts

import type { ExecutionItemExecutorArgs } from "@executionLayer/core/registry";

export type BusinessJourneyExecutor = (
    args: ExecutionItemExecutorArgs
) => Promise<void>;
