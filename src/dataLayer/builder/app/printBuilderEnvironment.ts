// src/dataLayer/builder/app/printBuilderEnvironment.ts

import { printKeyValue, printSection } from "@utils/cliFormat";
import type { FailureContext } from "./buildFailureContext";

export function printBuilderEnvironment(
    ctx: FailureContext & {
        platform?: string;
        application?: string;
        product?: string;
        journeyContext?: string;
    }
): void {
    printSection("Environment");
    printKeyValue("excelPath", ctx.excelPath);
    printKeyValue("sheetName", ctx.sheetName);
    printKeyValue("schemaName", ctx.schemaName);
    printKeyValue("outputPath", ctx.outputPath);
    printKeyValue("scriptIdFilter", ctx.scriptIdFilter);
    printKeyValue("excludeEmptyFields", ctx.excludeEmptyFields);
    printKeyValue("strictValidation", ctx.strictValidation);
    printKeyValue("verbose", ctx.verbose);
    printKeyValue("platform", ctx.platform ?? "");
    printKeyValue("application", ctx.application ?? "");
    printKeyValue("product", ctx.product ?? "");
    printKeyValue("journeyContext", ctx.journeyContext ?? "");
}

export function printAvailableSchemas(schemas: string[]): void {
    printSection("Available Schemas");
    console.log(schemas.join(", "));
}

export function printPipelineOrder(pluginNames: string[]): void {
    printSection("Pipeline order");
    console.log(pluginNames.join(" -> "));
}
