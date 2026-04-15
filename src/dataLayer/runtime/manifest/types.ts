// src/dataLayer/runtime/manifest/types.ts

import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";

export type GeneratedManifestItem = {
    key: string;
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
    sheetName: string;
    schemaName: string;
    filePath: string;
    validationReportPath?: string;
    caseCount: number;
    generatedAt: string;
};

export type GeneratedManifest = {
    generatedAt: string;
    data: Record<string, GeneratedManifestItem>;
};
