// src/dataLayer/builder/cli/resolveOutputPath.ts

import path from "node:path";
import { toRepoRelative } from "@utils/paths";
import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";

function safeName(name: string): string {
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "unknown";
}

function journeyContextFolderName(journeyContext: JourneyContext): string {
    return journeyContext.type.toLowerCase();
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

    return toRepoRelative(
        path.join(
            "src",
            "dataLayer",
            "generated",
            journeyContextFolderName(args.journeyContext),
            safeName(args.platform),
            safeName(args.application),
            safeName(args.product),
            `${safeName(args.sheetName)}.json`
        )
    );
}
