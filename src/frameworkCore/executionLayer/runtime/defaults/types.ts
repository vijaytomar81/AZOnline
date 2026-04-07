// src/executionLayer/runtime/defaults/types.ts

import type { ExecutionItemExecutor } from "@frameworkCore/executionLayer/core/registry";

export type ExecutorRegistration = {
    action: string;
    journey?: string;
    portal?: string;
    subType?: string;
    executorName: string;
    executor: ExecutionItemExecutor;
};
