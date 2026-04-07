// src/dataLayer/runtime/manifest/buildGeneratedManifestKey.ts

import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";

export function buildGeneratedManifestKey(args: {
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
    sheetName: string;
}): string {
    return [
        args.platform,
        args.application,
        args.product,
        args.journeyContext.type,
        args.sheetName,
    ].join(":");
}
