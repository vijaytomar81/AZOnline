// src/executionLayer/core/registry/registerExecutor.ts

import { buildExecutorKey } from "./buildExecutorKey";
import type {
    ExecutionItemExecutor,
    ExecutorRegistry,
} from "./types";

export function registerExecutor(
    registry: ExecutorRegistry,
    args: {
        action: string;
        journey?: string;
        portal?: string;
        subType?: string;
        executor: ExecutionItemExecutor;
    }
): void {
    const key = buildExecutorKey(args);
    registry[key] = args.executor;
}
