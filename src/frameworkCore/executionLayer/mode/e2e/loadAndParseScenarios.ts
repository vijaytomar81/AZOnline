// src/frameworkCore/executionLayer/mode/e2e/loadAndParseScenarios.ts

import type { Platform } from "@configLayer/models/platform.config";
import type { Application } from "@configLayer/models/application.config";
import type { Product } from "@configLayer/models/product.config";
import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import { parseScenarios } from "@frameworkCore/executionLayer/mode/e2e/scenario";
import { loadScenarioSheet } from "@frameworkCore/executionLayer/runtime/scenarioSheet";

export async function loadAndParseScenarios(args: {
    excelPath: string;
    sheetName: string;
    includeDisabled: boolean;
    platform?: Platform;
    application?: Application;
    product?: Product;
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
        platform: args.platform,
        application: args.application,
        product: args.product,
    });

    return parsed.scenarios;
}
