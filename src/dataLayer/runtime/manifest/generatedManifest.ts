// src/dataLayer/runtime/manifest/generatedManifest.ts

import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";
import { buildGeneratedManifestKey } from "./buildGeneratedManifestKey";
import { readGeneratedManifest } from "./readGeneratedManifest";
import { upsertGeneratedManifestItem as upsertItem } from "./upsertGeneratedManifestItem";
import type { GeneratedManifestItem } from "./types";

export function findGeneratedManifestItem(args: {
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
}): GeneratedManifestItem | undefined {
    const manifest = readGeneratedManifest();

    const key = buildGeneratedManifestKey({
        platform: args.platform,
        application: args.application,
        product: args.product,
        journeyContext: args.journeyContext,
    });

    return manifest.data[key];
}

export function upsertGeneratedManifestItem(args: {
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
    sheetName: string;
    schemaName: string;
    filePath: string;
    validationReportPath?: string;
    caseCount: number;
}): void {
    const manifest = readGeneratedManifest();

    const key = buildGeneratedManifestKey({
        platform: args.platform,
        application: args.application,
        product: args.product,
        journeyContext: args.journeyContext,
    });

    upsertItem({
        manifest,
        item: {
            key,
            platform: args.platform,
            application: args.application,
            product: args.product,
            journeyContext: args.journeyContext,
            sheetName: args.sheetName,
            schemaName: args.schemaName,
            filePath: args.filePath,
            validationReportPath: args.validationReportPath,
            caseCount: args.caseCount,
            generatedAt: new Date().toISOString(),
        },
    });
}

export { resolveManifestFilePath } from "./resolveManifestFilePath";
