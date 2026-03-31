// src/executionLayer/mode/e2e/loadAndParseScenarios.ts

import type { ExecutionScenario } from "@executionLayer/contracts";
import { parseScenarios } from "@executionLayer/mode/e2e/scenario";
import { loadScenarioSheet } from "@executionLayer/runtime/scenarioSheet";

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
