// src/frameworkCore/executionLayer/mode/data/buildScenarioFromCase.ts

import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import type { Platform } from "@configLayer/models/platform.config";
import type { Application } from "@configLayer/models/application.config";
import type { Product } from "@configLayer/models/product.config";
import type { BuiltCaseLike } from "./types";

export function buildScenarioFromCase(args: {
    item: BuiltCaseLike;
    platform: Platform;
    application: Application;
    product: Product;
}): ExecutionScenario {
    const scenarioId =
        args.item.scriptId ?? args.item.scriptName ?? "UNKNOWN_CASE";

    const scenarioName = args.item.scriptName ?? scenarioId;

    return {
        scenarioId,
        scenarioName,

        platform: args.platform,
        application: args.application,
        product: args.product,

        journeyStartWith: "newPolicy",

        description: scenarioName,
        execute: true,
        totalItems: 1,

        items: [
            {
                itemNo: 1,
                action: "NewBusiness",
                testCaseRef: scenarioId,
            },
        ],
    };
}
