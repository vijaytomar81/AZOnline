// src/data/data-builder/cli/args.ts

import path from "node:path";
import type { DataBuilderBaseArgs } from "../types";

function getCliValue(flag: string): string | undefined {
    const argv = process.argv.slice(2);
    const idx = argv.indexOf(flag);
    if (idx >= 0 && idx + 1 < argv.length) return argv[idx + 1];
    return undefined;
}

function hasFlag(flag: string): boolean {
    return process.argv.slice(2).includes(flag);
}

function parseBoolean(v?: string) {
    if (!v) return false;
    return ["true", "1", "yes", "y"].includes(v.toLowerCase());
}

/**
 * Parse CLI args.
 * Mandatory:
 *  - --excel
 *  - --sheet
 *
 * Optional:
 *  - --out (file OR folder). If omitted -> defaults to src/data/generated/<sheet>.json
 *  - --ids
 *  - --includeEmptyChildFields
 *  - --verbose
 */
export function parseBuildArgs(): DataBuilderBaseArgs & { verbose: boolean } {
    const sheetName = (getCliValue("--sheet") ?? process.env.SHEET ?? "").trim();
    const excelPath = (getCliValue("--excel") ?? process.env.EXCEL_PATH ?? "").trim();

    const includeEmptyChildFields = parseBoolean(
        getCliValue("--includeEmptyChildFields") ??
        process.env.INCLUDE_EMPTY_CHILD_FIELDS
    );

    const scriptIdFilter = (getCliValue("--ids") ?? process.env.SCRIPT_IDS ?? "").trim();

    const verbose =
        hasFlag("--verbose") ||
        (process.env.VERBOSE ?? "").toLowerCase() === "true";

    if (!excelPath) throw new Error("❌ EXCEL_PATH is required (or use --excel).");
    if (!sheetName) throw new Error("❌ SHEET is required (or use --sheet).");

    // ✅ DEFAULT OUTPUT: ALWAYS use sheetName.json
    // If user doesn't pass --out, we still write to generated/<sheet>.json
    const outRaw = (getCliValue("--out") ?? process.env.OUT_PATH ?? "").trim();
    const outputPath = outRaw
        ? outRaw
        : path.join("src", "data", "generated", `${safeSheetFilename(sheetName)}.json`);

    return {
        excelPath,
        sheetName,
        outputPath,
        scriptIdFilter,
        includeEmptyChildFields,
        verbose,
    };
}

function safeSheetFilename(name: string) {
    // conservative: remove invalid file chars on Windows/mac/linux
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "Sheet";
}