// src/execution/core/registry/registerExecutor.ts

import { buildExecutorKey } from "./buildExecutorKey";
import type { ExecutorRegistry, StepExecutor } from "./types";

export function registerExecutor(
    registry: ExecutorRegistry,
    args: {
        action: string;
        journey?: string;
        portal?: string;
        subType?: string;
        executor: StepExecutor;
    }
): void {
    const key = buildExecutorKey(args);
    registry[key] = args.executor;
}
