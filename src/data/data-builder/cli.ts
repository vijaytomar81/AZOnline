// src/data/data-builder/cli.ts
import path from "node:path";

import type { DataBuilderBaseArgs } from "./types";
import { normalizeArgv, getArg, hasFlag } from "../../utils/argv";
import { createLogger } from "../../utils/logger";
import { usage } from "./dataBuilderHelp";

const log = createLogger({
  prefix: "[data-builder]",
  verbose: true,
  withTimestamp: true,
  logToFile: false,
});

function parseBoolean(v?: string) {
  if (!v) return false;
  return ["true", "1", "yes", "y"].includes(v.toLowerCase());
}

export function parseBuildArgs(): DataBuilderBaseArgs & { verbose: boolean } {
  const argv = normalizeArgv(process.argv.slice(2));

  if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
    log.info(usage());
    process.exit(0);
  }

  const sheetName = (getArg(argv, "--sheet") ?? process.env.SHEET ?? "").trim();
  const excelPath = (getArg(argv, "--excel") ?? process.env.EXCEL_PATH ?? "").trim();

  const includeEmptyChildFields = parseBoolean(
    getArg(argv, "--includeEmptyChildFields") ?? process.env.INCLUDE_EMPTY_CHILD_FIELDS
  );

  const scriptIdFilter = (getArg(argv, "--ids") ?? process.env.SCRIPT_IDS ?? "").trim();

  const verbose =
    hasFlag(argv, "--verbose") ||
    (process.env.VERBOSE ?? "").toLowerCase() === "true";

  if (!excelPath) throw new Error("❌ EXCEL_PATH is required (or use --excel).");
  if (!sheetName) throw new Error("❌ SHEET is required (or use --sheet).");

  const outRaw = (getArg(argv, "--out") ?? process.env.OUT_PATH ?? "").trim();
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