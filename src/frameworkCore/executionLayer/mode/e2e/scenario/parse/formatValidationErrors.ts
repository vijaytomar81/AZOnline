// src/frameworkCore/executionLayer/mode/e2e/scenario/parse/formatValidationErrors.ts

import type { ScenarioValidationResult } from "../types";

export function formatValidationErrors(
    title: string,
    items: ScenarioValidationResult[]
): string {
    const lines = items
        .filter((item) => item.errors.length > 0)
        .flatMap((item) =>
            item.errors.map((error) => `[${item.scenarioId}] ${error}`)
        );

    return `${title}\n${lines.join("\n")}`;
}
