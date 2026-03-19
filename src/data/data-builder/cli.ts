// src/data/data-builder/cli.ts
import path from "node:path";
import type { DataBuilderBaseArgs } from "./types";
import { normalizeArgv, getArg, hasFlag } from "../../utils/argv";
import { createLogger } from "../../utils/logger";
import { printSection } from "../../utils/cliFormat";
import { usage } from "./dataBuilderHelp";

export function createDataBuilderLogger(verbose = false) {
  return createLogger({
    prefix: "[data-builder]",
    logLevel: verbose ? "debug" : "info",
    withTimestamp: true,
    logToFile: false,
  });
}

function parseBoolean(v?: string) {
  return ["true", "1", "yes", "y"].includes(String(v ?? "").toLowerCase());
}

function safeSheetFilename(name: string) {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "Sheet";
}

export function parseBuildArgs(): DataBuilderBaseArgs & { verbose: boolean } {
  const argv = normalizeArgv(process.argv.slice(2));
  const verbose = hasFlag(argv, "--verbose") || parseBoolean(process.env.VERBOSE);
  const log = createDataBuilderLogger(verbose);

  if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
    printSection("Data Builder Help");
    log.info(usage());
    process.exit(0);
  }

  const excelPath = String(getArg(argv, "--excel") ?? process.env.EXCEL_PATH ?? "").trim();
  const sheetName = String(getArg(argv, "--sheet") ?? process.env.SHEET ?? "").trim();
  const schemaName = String(getArg(argv, "--schema") ?? process.env.SCHEMA ?? "master").trim();
  const scriptIdFilter = String(getArg(argv, "--ids") ?? process.env.SCRIPT_IDS ?? "").trim();
  const excludeEmptyFields =
    hasFlag(argv, "--excludeEmptyFields") || parseBoolean(process.env.EXCLUDE_EMPTY_FIELDS);
  const strictValidation =
    hasFlag(argv, "--strictValidation") || parseBoolean(process.env.STRICT_VALIDATION);

  if (!excelPath) throw new Error("❌ EXCEL_PATH is required (or use --excel).");
  if (!sheetName) throw new Error("❌ SHEET is required (or use --sheet).");

  const outRaw = String(getArg(argv, "--out") ?? process.env.OUT_PATH ?? "").trim();
  const outputPath =
    outRaw || path.join("src", "data", "generated", `${safeSheetFilename(sheetName)}.json`);

  return {
    excelPath,
    sheetName,
    schemaName,
    outputPath,
    scriptIdFilter,
    excludeEmptyFields,
    strictValidation,
    verbose,
  };
}