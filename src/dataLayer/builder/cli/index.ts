// src/dataLayer/builder/cli/index.ts

import { getArg, hasFlag, normalizeArgv } from "@utils/argv";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { normalizeApplication } from "@configLayer/normalizers/normalizeApplication";
import { JOURNEY_TYPES, type JourneyContext } from "@configLayer/models/journeyContext.config";
import { normalizePlatform } from "@configLayer/normalizers/normalizePlatform";
import { normalizeProduct } from "@configLayer/normalizers/normalizeProduct";
import type { DataBuilderBaseArgs } from "../types";
import { DataBuilderError } from "../errors";
import { parseBoolean } from "./parseBoolean";
import { resolveOutputPath } from "./resolveOutputPath";
import { resolveSchemaArg } from "./resolveSchemaArg";
import { showBuilderHelp } from "./showBuilderHelp";

function resolveJourneyContext(raw?: string): JourneyContext {
    const value = String(raw ?? "").trim();

    if (!value) {
        return { type: JOURNEY_TYPES.NEW_BUSINESS };
    }

    if (value === JOURNEY_TYPES.NEW_BUSINESS) {
        return { type: JOURNEY_TYPES.NEW_BUSINESS };
    }

    if (value === JOURNEY_TYPES.RENEWAL) {
        return { type: JOURNEY_TYPES.RENEWAL };
    }

    if (value === JOURNEY_TYPES.MTC) {
        return { type: JOURNEY_TYPES.MTC };
    }

    if (value === JOURNEY_TYPES.MTA) {
        throw new DataBuilderError({
            code: "JOURNEY_CONTEXT_SUBTYPE_MISSING",
            stage: "cli-args",
            source: "cli/index.ts",
            message: 'For journeyContext "MTA", also provide a supported subtype in a future enhancement.',
        });
    }

    throw new DataBuilderError({
        code: "JOURNEY_CONTEXT_INVALID",
        stage: "cli-args",
        source: "cli/index.ts",
        message: `Unsupported journeyContext "${value}".`,
    });
}

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

    const platformRaw = String(
        getArg(argv, "--platform") ?? process.env.PLATFORM ?? ""
    ).trim();

    const applicationRaw = String(
        getArg(argv, "--application") ?? process.env.APPLICATION ?? ""
    ).trim();

    const productRaw = String(
        getArg(argv, "--product") ?? process.env.PRODUCT ?? ""
    ).trim();

    const journeyContextRaw = String(
        getArg(argv, "--journeyContext") ?? process.env.JOURNEY_CONTEXT ?? ""
    ).trim();

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

    const platform = normalizePlatform(platformRaw);
    if (!platform) {
        throw new DataBuilderError({
            code: "PLATFORM_MISSING",
            stage: "cli-args",
            source: "cli/index.ts",
            message: "PLATFORM is required (or use --platform).",
        });
    }

    const application = normalizeApplication(applicationRaw);
    if (!application) {
        throw new DataBuilderError({
            code: "APPLICATION_MISSING",
            stage: "cli-args",
            source: "cli/index.ts",
            message: "APPLICATION is required (or use --application).",
        });
    }

    const product = normalizeProduct(productRaw);
    if (!product) {
        throw new DataBuilderError({
            code: "PRODUCT_MISSING",
            stage: "cli-args",
            source: "cli/index.ts",
            message: "PRODUCT is required (or use --product).",
        });
    }

    const journeyContext = resolveJourneyContext(journeyContextRaw);

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
        sheetName,
        platform,
        application,
        product,
        journeyContext,
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
        platform,
        application,
        product,
        journeyContext,
    };
}
