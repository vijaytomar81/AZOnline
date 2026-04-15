// src/frameworkCore/executionLayer/core/context/outputs.ts

import type { ExecutionContext } from "@frameworkCore/executionLayer/contracts";

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
