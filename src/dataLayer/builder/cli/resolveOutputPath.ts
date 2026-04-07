// src/dataLayer/builder/cli/resolveOutputPath.ts

import path from "node:path";
import { toRepoRelative } from "@utils/paths";
import type { Platform } from "@configLayer/models/platform.config";
import type { Application } from "@configLayer/models/application.config";
import type { Product } from "@configLayer/models/product.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";

function safe(name: string): string {
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim();
}

export function resolveOutputPath(args: {
    outRaw: string;
    sheetName: string;
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
}): string {
    if (args.outRaw) {
        return args.outRaw;
    }

    const journeyFolder = args.journeyContext.type.toLowerCase();

    return toRepoRelative(
        path.join(
            "src/dataLayer/generated",
            journeyFolder,
            args.platform.toLowerCase(),
            args.application.toLowerCase(),
            args.product.toLowerCase(),
            `${safe(args.sheetName)}.json`
        )
    );
}