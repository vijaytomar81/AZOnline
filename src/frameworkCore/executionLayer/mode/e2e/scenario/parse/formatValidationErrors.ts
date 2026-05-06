// src/frameworkCore/executionLayer/mode/e2e/scenario/parse/formatValidationErrors.ts

import type { ScenarioValidationResult } from "../types";
import { getExecutionItemValidationHelp } from "../validate/validateExecutionItem";

export function formatValidationErrors(
    title: string,
    results: ScenarioValidationResult[]
): string {
    const lines = results.flatMap((result) =>
        result.errors.map((error) => `[${result.scenarioId}] ${error}`)
    );

    const help = getExecutionItemValidationHelp();

    return [
        title,
        ...lines,
        "",
        "Allowed values:",
        ...help.map((line) => `- ${line}`),
    ].join("\n");
}
