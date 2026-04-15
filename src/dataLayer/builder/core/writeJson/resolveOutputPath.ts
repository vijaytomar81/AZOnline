// src/dataLayer/builder/core/writeJson/resolveOutputPath.ts

import path from "node:path";
import { ROOT } from "@utils/paths";
import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";

function safeName(name: string): string {
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "unknown";
}

function isLikelyDir(filePath: string): boolean {
    const normalized = filePath.replace(/\\/g, "/").trim();

    if (!normalized) return true;
    if (normalized.endsWith("/")) return true;
    if (normalized.endsWith("\\")) return true;

    return path.extname(normalized) === "";
}

function journeyContextFolderName(journeyContext: JourneyContext): string {
    return journeyContext.type.toLowerCase();
}

function getDefaultOutputPath(args: {
    sheetName: string;
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
}): string {
    return path.join(
        "src",
        "dataLayer",
        "generated",
        journeyContextFolderName(args.journeyContext),
        safeName(args.platform),
        safeName(args.application),
        safeName(args.product),
        `${safeName(args.sheetName)}.json`
    );
}

export function resolveOutputPath(args: {
    outputPath?: string;
    sheetName: string;
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
}): {
    absBaseOut: string;
} {
    const outRaw = String(args.outputPath ?? "").trim();
    const configuredPath =
        outRaw ||
        getDefaultOutputPath({
            sheetName: args.sheetName,
            platform: args.platform,
            application: args.application,
            product: args.product,
            journeyContext: args.journeyContext,
        });

    const targetPath = isLikelyDir(configuredPath)
        ? path.join(configuredPath, `${safeName(args.sheetName)}.json`)
        : configuredPath;

    const absBaseOut = path.isAbsolute(targetPath)
        ? targetPath
        : path.join(ROOT, targetPath);

    return { absBaseOut };
}
