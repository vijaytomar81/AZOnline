// src/dataLayer/runtime/cases/loadCases.ts

import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";
import type { CasesFile, BuiltCase } from "../../builder/types";
import { DataBuilderError } from "../../builder/errors";
import { getCasesFile } from "./getCasesFile";
import { resolveCasesFilePath } from "./resolveCasesFilePath";

export type CaseObject = Record<string, any>;

export function loadCases(args: {
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
    sheetName: string;
    schemaName?: string;
}): Array<{ scriptName: string; payload: CaseObject }> {
    const filePath = resolveCasesFilePath(args);
    const json = getCasesFile(args) as CasesFile;

    if (!Array.isArray(json.cases)) {
        throw new DataBuilderError({
            code: "INVALID_CASES_JSON",
            stage: "load-cases-file",
            source: "loadCases",
            message: `Invalid cases JSON structure. Expected "cases" array in ${filePath}`,
            context: {
                platform: args.platform,
                application: args.application,
                product: args.product,
                journeyContext: args.journeyContext,
                sheetName: args.sheetName,
                schemaName: args.schemaName ?? "",
                filePath,
            },
        });
    }

    return json.cases.map((c: BuiltCase) => ({
        scriptName: c.scriptName,
        payload: c.data,
    }));
}
