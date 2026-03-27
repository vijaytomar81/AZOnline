// src/data/builder/cli.ts

import path from "node:path";
import type { DataBuilderBaseArgs } from "./types";
import { normalizeArgv, getArg, hasFlag } from "@utils/argv";
import { printSection } from "@utils/cliFormat";
import { getGeneratedSchemaDir, toRepoRelative } from "@utils/paths";
import { usage } from "./help";
import { resolveSchemaName } from "../data-definitions";
import { DataBuilderError } from "./errors";
import { createLogEvent, logEvent } from "@logging/log";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";

function emitFrameworkLog(args: {
  scope: string;
  level: "debug" | "info" | "warn" | "error";
  message: string;
}): void {
  logEvent(
    createLogEvent({
      level: args.level,
      category: LOG_CATEGORIES.FRAMEWORK,
      message: args.message,
      scope: args.scope,
    })
  );
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
  const logScope = "data-builder";

  if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
    printSection("Data Builder Help");
    emitFrameworkLog({
      scope: logScope,
      level: LOG_LEVELS.INFO,
      message: usage(),
    });
    process.exit(0);
  }

  const excelPath = String(getArg(argv, "--excel") ?? process.env.EXCEL_PATH ?? "").trim();
  const sheetName = String(getArg(argv, "--sheet") ?? process.env.SHEET ?? "").trim();
  const schemaArg = String(getArg(argv, "--schema") ?? process.env.SCHEMA ?? "").trim();
  const scriptIdFilter = String(getArg(argv, "--ids") ?? process.env.SCRIPT_IDS ?? "").trim();

  const excludeEmptyFields =
    hasFlag(argv, "--excludeEmptyFields") || parseBoolean(process.env.EXCLUDE_EMPTY_FIELDS);

  const strictValidation =
    hasFlag(argv, "--strictValidation") || parseBoolean(process.env.STRICT_VALIDATION);

  if (!excelPath) {
    throw new DataBuilderError({
      code: "EXCEL_PATH_MISSING",
      stage: "cli-args",
      source: "cli.ts",
      message: "EXCEL_PATH is required (or use --excel).",
    });
  }

  if (!sheetName) {
    throw new DataBuilderError({
      code: "SHEET_NAME_MISSING",
      stage: "cli-args",
      source: "cli.ts",
      message: "SHEET is required (or use --sheet).",
    });
  }

  let schemaName: string;
  try {
    schemaName = resolveSchemaName(schemaArg, sheetName);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    throw new DataBuilderError({
      code: "SCHEMA_RESOLUTION_FAILED",
      stage: "schema-resolution",
      source: "cli.ts",
      message,
      context: {
        sheetName,
        schemaArg,
      },
    });
  }

  if (verbose) {
    emitFrameworkLog({
      scope: logScope,
      level: LOG_LEVELS.DEBUG,
      message: `Resolved schema "${schemaName}" from sheet "${sheetName}"`,
    });
  }

  const outRaw = String(getArg(argv, "--out") ?? process.env.OUT_PATH ?? "").trim();

  const outputPath =
    outRaw ||
    toRepoRelative(
      path.join(
        getGeneratedSchemaDir(schemaName),
        `${safeSheetFilename(sheetName)}.json`
      )
    );

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