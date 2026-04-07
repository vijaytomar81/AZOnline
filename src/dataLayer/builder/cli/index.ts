// src/dataLayer/builder/cli/index.ts

import { getArg, hasFlag, normalizeArgv } from "@utils/argv";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import type { DataBuilderBaseArgs } from "../types";
import { DataBuilderError } from "../errors";
import { parseBoolean } from "./parseBoolean";
import { resolveOutputPath } from "./resolveOutputPath";
import { resolveSchemaArg } from "./resolveSchemaArg";
import { showBuilderHelp } from "./showBuilderHelp";

export function parseBuildArgs(): DataBuilderBaseArgs & { verbose: boolean } {
    const argv = normalizeArgv(process.argv.slice(2));
    const logScope = "data-builder";
    const verbose =
        hasFlag(argv, "--verbose") || parseBoolean(process.env.VERBOSE);

    if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
        showBuilderHelp(logScope);
    }

    const excelPath = String(
        getArg(argv, "--excel") ?? process.env.EXCEL_PATH ?? ""
    ).trim();

    const sheetName = String(
        getArg(argv, "--sheet") ?? process.env.SHEET ?? ""
    ).trim();

    const schemaArg = String(
        getArg(argv, "--schema") ?? process.env.SCHEMA ?? ""
    ).trim();

    const scriptIdFilter = String(
        getArg(argv, "--ids") ?? process.env.SCRIPT_IDS ?? ""
    ).trim();

    const excludeEmptyFields =
        hasFlag(argv, "--excludeEmptyFields") ||
        parseBoolean(process.env.EXCLUDE_EMPTY_FIELDS);

    const strictValidation =
        hasFlag(argv, "--strictValidation") ||
        parseBoolean(process.env.STRICT_VALIDATION);

    if (!excelPath) {
        throw new DataBuilderError({
            code: "EXCEL_PATH_MISSING",
            stage: "cli-args",
            source: "cli/index.ts",
            message: "EXCEL_PATH is required (or use --excel).",
        });
    }

    if (!sheetName) {
        throw new DataBuilderError({
            code: "SHEET_NAME_MISSING",
            stage: "cli-args",
            source: "cli/index.ts",
            message: "SHEET is required (or use --sheet).",
        });
    }

    const schemaName = resolveSchemaArg({
        schemaArg,
        sheetName,
    });

    if (verbose) {
        emitLog({
            scope: logScope,
            level: LOG_LEVELS.DEBUG,
            message: `Resolved schema "${schemaName}" from sheet "${sheetName}"`,
            category: LOG_CATEGORIES.FRAMEWORK,
        });
    }

    const outRaw = String(
        getArg(argv, "--out") ?? process.env.OUT_PATH ?? ""
    ).trim();

    const outputPath = resolveOutputPath({
        outRaw,
        schemaName,
        sheetName,
    });

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