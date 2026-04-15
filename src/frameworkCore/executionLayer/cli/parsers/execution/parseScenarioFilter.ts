// src/frameworkCore/executionLayer/cli/parsers/execution/parseScenarioFilter.ts

export function parseScenarioFilter(raw?: string): string[] {
    return String(raw ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}
