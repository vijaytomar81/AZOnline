// src/dataLayer/runtime/cases/buildCasesFileNotFoundError.ts

import { DataBuilderError } from "../../builder/errors";
import { findGeneratedManifestItem } from "@dataLayer/runtime/manifest/generatedManifest";

export function buildCasesFileNotFoundError(args: {
    sheetName: string;
    schemaName: string;
    attemptedPath?: string;
}): DataBuilderError {
    const manifestItem = findGeneratedManifestItem({
        sheetName: args.sheetName,
        schemaName: args.schemaName,
    });

    const lines: string[] = [
        "No generated data JSON found via manifest.",
        "",
        `Sheet   : ${args.sheetName}`,
        `Schema  : ${args.schemaName}`,
        "",
    ];

    if (manifestItem) {
        lines.push("Manifest entry found:");
        lines.push(`  Key          : ${manifestItem.key}`);
        lines.push(`  File         : ${manifestItem.filePath}`);

        if (manifestItem.validationReportPath) {
            lines.push(`  Validation   : ${manifestItem.validationReportPath}`);
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
        `  npm run data:build -- --excel <path> --sheet "${args.sheetName}"`
    );

    return new DataBuilderError({
        code: "CASES_FILE_NOT_FOUND",
        stage: "load-cases-file",
        source: "buildCasesFileNotFoundError",
        message: lines.join("\n"),
        context: {
            sheetName: args.sheetName,
            schemaName: args.schemaName,
            filePath: args.attemptedPath ?? "",
            manifestKey: manifestItem?.key ?? "",
            manifestFilePath: manifestItem?.filePath ?? "",
            manifestGeneratedAt: manifestItem?.generatedAt ?? "",
        },
    });
}