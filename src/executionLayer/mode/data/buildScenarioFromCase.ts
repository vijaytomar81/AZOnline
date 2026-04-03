// src/executionLayer/mode/data/buildScenarioFromCase.ts

import type { ExecutionScenario } from "@executionLayer/contracts";
import type {
    Application,
    Product,
} from "@config/domain/routing.config";
import { resolveScenarioDefaultsFromData } from "@config/domain/resolveScenarioDefaults";
import type { BuiltCaseLike } from "./types";
import { resolveDataJourney } from "./resolveDataJourney";
import { resolveEntryPoint } from "./resolveEntryPoint";

export function buildScenarioFromCase(args: {
    source: string;
    schemaName: string;
    item: BuiltCaseLike;
    application?: Application;
    product?: Product;
}): ExecutionScenario {
    const scenarioId =
        args.item.scriptId ?? args.item.scriptName ?? "UNKNOWN_CASE";
    const scenarioName = args.item.scriptName ?? scenarioId;
    const entryPoint = resolveEntryPoint(args.schemaName);
    const defaults = resolveScenarioDefaultsFromData({
        source: args.source,
        schemaName: args.schemaName,
        applicationOverride: args.application,
        productOverride: args.product,
    });

    return {
        scenarioId,
        scenarioName,
        journey: resolveDataJourney({
            schemaName: args.schemaName,
            builtCase: args.item,
        }),
        policyContext: "NewBusiness",
        entryPoint,
        application: defaults.application,
        product: defaults.product,
        description: scenarioName,
        execute: true,
        totalItems: 1,
        items: [
            {
                itemNo: 1,
                action: "NewBusiness",
                subType: undefined,
                portal: undefined,
                testCaseRef: scenarioId,
            },
        ],
    };
}
