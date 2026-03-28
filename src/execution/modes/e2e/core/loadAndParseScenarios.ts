// src/execution/modes/e2e/core/loadAndParseScenarios.ts

import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import { loadScenarioSheet } from "@execution/runtime/loadScenarioSheet";
import { parseScenarios } from "@execution/modes/e2e/scenario/parser";

export async function loadAndParseScenarios(args: {
    excelPath: string;
    sheetName: string;
    includeDisabled: boolean;
}): Promise<ExecutionScenario[]> {
    const loaded = await loadScenarioSheet({
        excelPath: args.excelPath,
        sheetName: args.sheetName,
        logScope: "execution:loader",
    });

    const parsed = parseScenarios(loaded.rows, {
        includeDisabled: args.includeDisabled,
        failOnTemplateErrors: true,
        failOnValidationErrors: true,
    });

    return parsed.scenarios;
}
