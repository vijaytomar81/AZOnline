// src/frameworkCore/executionLayer/cli/parsers/mode/parseMode.ts

export type ExecutionMode = "data" | "e2e";

export function parseMode(raw?: string): ExecutionMode {
    return String(raw ?? "e2e").trim().toLowerCase() === "data"
        ? "data"
        : "e2e";
}
