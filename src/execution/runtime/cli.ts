// src/execution/runtime/cli.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";

export type ExecutionMode = "e2e" | "data";

export const DEFAULT_ITERATIONS = 1;

export function normalizeMode(raw?: string): ExecutionMode {
    return normalizeSpaces(String(raw ?? "e2e")).toLowerCase() === "data"
        ? "data"
        : "e2e";
}

export function parseScenarioFilter(raw?: string): string[] {
    return normalizeSpaces(String(raw ?? ""))
        .split(",")
        .map((item) => normalizeSpaces(item))
        .filter(Boolean);
}

export function parseIterations(raw?: string): number {
    const value = normalizeSpaces(String(raw ?? ""));
    if (!value) return DEFAULT_ITERATIONS;

    const num = Number(value);
    if (!Number.isInteger(num) || num <= 0) {
        throw new AppError({
            code: "INVALID_ITERATIONS",
            stage: "cli-parse",
            source: "execution-cli",
            message: `Invalid --iterations value "${value}". It must be a positive integer.`,
        });
    }

    return num;
}