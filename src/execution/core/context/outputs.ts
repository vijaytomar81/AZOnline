// src/execution/core/context/outputs.ts

import type { ExecutionContext } from "./executionContext.types";

export function setContextOutput(
    context: ExecutionContext,
    key: string,
    value: unknown
): void {
    context.outputs[key] = value;
}

export function getContextOutput<T>(
    context: ExecutionContext,
    key: string
): T | undefined {
    return context.outputs[key] as T | undefined;
}
