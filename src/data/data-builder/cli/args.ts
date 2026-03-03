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

function usage(): string {
    return `
Data Builder CLI

Usage:
  ts-node src/data/data-builder/index.ts --excel <path> --sheet <name> [options]

Required:
  --excel <path>        Path to Excel file
                        Example:
                          --excel ./data.xlsx
                          --excel "/Users/me/Documents/Test Data.xlsx"

  --sheet <name>        Sheet name to process
                        Example:
                          --sheet FlowNB
                          --sheet "Motor Journey"

Optional:
  --out <path>          Output file OR folder
                        (default: src/data/generated/<sheet>.json)
                        Examples:
                          --out ./output.json
                          --out ./generated/
                          --out src/data/generated/FlowNB.custom.json

  --ids <id1,id2>       Filter by script IDs (comma-separated, ranges supported)
                        (default: all IDs)
                        Example:
                          --ids 1,3,5
                          --ids 1-5
                          --ids 1,3,4-6,10

  --includeEmptyChildFields <true|false>
                        Include empty child fields (default: false)
                        Examples:
                          --includeEmptyChildFields true
                          --includeEmptyChildFields false

  --verbose             Enable verbose logging
                        Example:
                          --verbose

  --help, -h            Show this help


Environment variable equivalents:
  EXCEL_PATH
  SHEET
  OUT_PATH
  SCRIPT_IDS
  INCLUDE_EMPTY_CHILD_FIELDS
  VERBOSE


Examples (CLI):

  Basic:
    npm run data:build -- --excel ./data.xlsx --sheet FlowNB

  With verbose logging:
    npm run data:build -- --excel ./data.xlsx --sheet FlowNB --verbose

  With script ID filtering:
    npm run data:build -- --excel ./data.xlsx --sheet FlowNB --ids 1,3,5-8

  Include empty child fields:
    npm run data:build -- --excel ./data.xlsx --sheet FlowNB --includeEmptyChildFields true

  Custom output file:
    npm run data:build -- --excel ./data.xlsx --sheet FlowNB --out ./custom.json

  Everything combined:
    npm run data:build -- \
      --excel ./data.xlsx \
      --sheet FlowNB \
      --ids 1-10 \
      --includeEmptyChildFields true \
      --out ./generated/FlowNB.full.json \
      --verbose


Examples (Environment variables):

  macOS / Linux:
    EXCEL_PATH=./data.xlsx SHEET=FlowNB npm run data:build

  Windows (PowerShell):
    $env:EXCEL_PATH="./data.xlsx"; $env:SHEET="FlowNB"; npm run data:build

`.trim();
}

/**
 * Parse CLI args.
 */
export function parseBuildArgs(): DataBuilderBaseArgs & { verbose: boolean } {
    // ✅ Help support
    if (hasFlag("--help") || hasFlag("-h")) {
        console.log(usage());
        process.exit(0);
    }

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
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "Sheet";
}