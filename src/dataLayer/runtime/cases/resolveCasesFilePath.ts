// src/dataLayer/runtime/cases/resolveCasesFilePath.ts

import fs from "node:fs";
import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";
import {
    findGeneratedManifestItem,
    resolveManifestFilePath,
} from "@dataLayer/runtime/manifest/generatedManifest";
import { resolveExplicitCasesFile } from "./resolveExplicitCasesFile";
import { buildCasesFileNotFoundError } from "./buildCasesFileNotFoundError";

export function resolveCasesFilePath(args: {
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
    sheetName: string;
    schemaName?: string;
}): string {
    const explicit = resolveExplicitCasesFile();
    if (explicit) {
        return explicit;
    }

    const manifestItem = findGeneratedManifestItem({
        platform: args.platform,
        application: args.application,
        product: args.product,
        journeyContext: args.journeyContext,
        sheetName: args.sheetName,
    });

    const manifestPath = resolveManifestFilePath(manifestItem);

    if (!manifestPath) {
        throw buildCasesFileNotFoundError({
            platform: args.platform,
            application: args.application,
            product: args.product,
            journeyContext: args.journeyContext,
            sheetName: args.sheetName,
            schemaName: args.schemaName ?? "",
        });
    }

    if (!fs.existsSync(manifestPath)) {
        throw buildCasesFileNotFoundError({
            platform: args.platform,
            application: args.application,
            product: args.product,
            journeyContext: args.journeyContext,
            sheetName: args.sheetName,
            schemaName: args.schemaName ?? "",
            attemptedPath: manifestPath,
        });
    }

    return manifestPath;
}
