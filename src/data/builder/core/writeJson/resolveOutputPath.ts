// src/data/builder/core/writeJson/resolveOutputPath.ts

import path from "node:path";
import { ROOT, getGeneratedSchemaDir } from "@utils/paths";

function safeSheetFilename(name: string): string {
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "Sheet";
}

function isLikelyDir(filePath: string): boolean {
    const normalized = filePath.replace(/\\/g, "/").trim();

    if (!normalized) return true;
    if (normalized.endsWith("/")) return true;
    if (normalized.endsWith("\\")) return true;

    return path.extname(normalized) === "";
}

function getDefaultOutputPath(schemaName: string, sheetName: string): string {
    return path.join(
        getGeneratedSchemaDir(schemaName),
        `${safeSheetFilename(sheetName)}.json`
    );
}

export function resolveOutputPath(args: {
    outputPath?: string;
    schemaName: string;
    sheetName: string;
}): {
    absBaseOut: string;
} {
    const outRaw = String(args.outputPath ?? "").trim();
    const configuredPath =
        outRaw || getDefaultOutputPath(args.schemaName, args.sheetName);

    const targetPath = isLikelyDir(configuredPath)
        ? path.join(configuredPath, `${safeSheetFilename(args.sheetName)}.json`)
        : configuredPath;

    const absBaseOut = path.isAbsolute(targetPath)
        ? targetPath
        : path.join(ROOT, targetPath);

    return { absBaseOut };
}