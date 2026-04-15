// src/dataLayer/runtime/cases/buildCasesFileNotFoundError.ts

import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";
import { DataBuilderError } from "../../builder/errors";
import { findGeneratedManifestItem } from "@dataLayer/runtime/manifest/generatedManifest";

export function buildCasesFileNotFoundError(args: {
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
    schemaName: string;
    attemptedPath?: string;
}): DataBuilderError {
    const manifestItem = findGeneratedManifestItem({
        platform: args.platform,
        application: args.application,
        product: args.product,
        journeyContext: args.journeyContext,
    });

    const lines: string[] = [
        "No generated data JSON found via manifest.",
        "",
        `Platform       : ${args.platform}`,
        `Application    : ${args.application}`,
        `Product        : ${args.product}`,
        `JourneyContext : ${JSON.stringify(args.journeyContext)}`,
        `Schema         : ${args.schemaName}`,
        "",
    ];

    if (manifestItem) {
        lines.push("Manifest entry found:");
        lines.push(`  Key          : ${manifestItem.key}`);
        lines.push(`  File         : ${manifestItem.filePath}`);

        if (manifestItem.validationReportPath) {
            lines.push(`  Validation   : ${manifestItem.validationReportPath}`);
        }

        if (manifestItem.sheetName) {
            lines.push(`  Sheet        : ${manifestItem.sheetName}`);
        }

        lines.push(`  Case Count   : ${manifestItem.caseCount}`);
        lines.push(`  Generated At : ${manifestItem.generatedAt}`);
        lines.push("");

        if (args.attemptedPath) {
            lines.push("The manifest entry exists, but file is missing:");
            lines.push(`  ${args.attemptedPath}`);
            lines.push("");
        }
    } else {
        lines.push("No matching entry found in generated index.json.");
        lines.push("");
    }

    lines.push("Next step:");
    lines.push(
        `  npm run data:build -- --excel <path> --sheet "<sheet>" --platform "${args.platform}" --application "${args.application}" --product "${args.product}" --journeyContext "${args.journeyContext.type}"`
    );

    return new DataBuilderError({
        code: "CASES_FILE_NOT_FOUND",
        stage: "load-cases-file",
        source: "buildCasesFileNotFoundError",
        message: lines.join("\n"),
        context: {
            platform: args.platform,
            application: args.application,
            product: args.product,
            journeyContext: args.journeyContext,
            schemaName: args.schemaName,
            filePath: args.attemptedPath ?? "",
            manifestKey: manifestItem?.key ?? "",
            manifestFilePath: manifestItem?.filePath ?? "",
            manifestGeneratedAt: manifestItem?.generatedAt ?? "",
        },
    });
}
