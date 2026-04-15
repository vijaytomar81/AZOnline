// src/dataLayer/builder/core/writeJson/resolveWriteJsonInputs.ts

import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";
import type { CasesFile } from "../../types";
import { DataBuilderError } from "../../errors";

export function resolveWriteJsonInputs(args: {
    casesFile?: CasesFile;
    sheetName?: string;
    schemaName?: string;
    platform?: Platform;
    application?: Application;
    product?: Product;
    journeyContext?: JourneyContext;
}): {
    casesFile: CasesFile;
    sheetName: string;
    schemaName: string;
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
} {
    const casesFile = args.casesFile;

    if (!casesFile) {
        throw new DataBuilderError({
            code: "CASES_FILE_MISSING",
            stage: "write-json",
            source: "resolveWriteJsonInputs",
            message: "casesFile missing. build-cases must run before write-json.",
        });
    }

    const sheetName = String(casesFile.sheet ?? args.sheetName ?? "").trim();
    if (!sheetName) {
        throw new DataBuilderError({
            code: "SHEET_NAME_MISSING",
            stage: "write-json",
            source: "resolveWriteJsonInputs",
            message: "sheetName missing.",
        });
    }

    const schemaName = String(args.schemaName ?? "").trim();
    if (!schemaName) {
        throw new DataBuilderError({
            code: "SCHEMA_NAME_MISSING",
            stage: "write-json",
            source: "resolveWriteJsonInputs",
            message: "schemaName missing. Ensure schema is resolved before write-json.",
        });
    }

    if (!args.platform) {
        throw new DataBuilderError({
            code: "PLATFORM_MISSING",
            stage: "write-json",
            source: "resolveWriteJsonInputs",
            message: "platform missing.",
        });
    }

    if (!args.application) {
        throw new DataBuilderError({
            code: "APPLICATION_MISSING",
            stage: "write-json",
            source: "resolveWriteJsonInputs",
            message: "application missing.",
        });
    }

    if (!args.product) {
        throw new DataBuilderError({
            code: "PRODUCT_MISSING",
            stage: "write-json",
            source: "resolveWriteJsonInputs",
            message: "product missing.",
        });
    }

    if (!args.journeyContext) {
        throw new DataBuilderError({
            code: "JOURNEY_CONTEXT_MISSING",
            stage: "write-json",
            source: "resolveWriteJsonInputs",
            message: "journeyContext missing.",
        });
    }

    return {
        casesFile,
        sheetName,
        schemaName,
        platform: args.platform,
        application: args.application,
        product: args.product,
        journeyContext: args.journeyContext,
    };
}
