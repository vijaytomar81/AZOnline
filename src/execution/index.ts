// src/execution/index.ts

import { AppError } from "@utils/errors";
import { getArg, hasFlag, normalizeArgv } from "@utils/argv";
import { normalizeSpaces } from "@utils/text";
import { setLogVerbose } from "@logging/core/logConfig";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { createLogEvent, logEvent } from "@logging/log";
import { printDataModeHelp } from "./modes/data/help";
import { usage } from "./modes/e2e/help";
import {
    normalizeMode,
    parseIterations,
    parseScenarioFilter,
} from "./runtime/cli";
import { runDataMode } from "./modes/data/runner";
import { runE2EMode } from "./modes/e2e/runner";

function emitFrameworkLog(
    level: "debug" | "info" | "warn" | "error",
    message: string
): void {
    logEvent(createLogEvent({
        level,
        category: LOG_CATEGORIES.FRAMEWORK,
        message,
        scope: "run",
    }));
}

function parseParallel(raw?: string): number {
    const value = normalizeSpaces(String(raw ?? ""));

    if (!value) {
        return 1;
    }

    const num = Number(value);

    if (!Number.isInteger(num) || num <= 0) {
        throw new AppError({
            code: "INVALID_PARALLEL",
            stage: "cli-parse",
            source: "execution-index",
            message: `Invalid --parallel value "${value}". It must be a positive integer.`,
        });
    }

    return num;
}

async function runDataModeFromCli(args: {
    source: string;
    schemaArg?: string;
    iterations: number;
    parallel: number;
    verbose: boolean;
}): Promise<void> {
    if (!args.source) {
        throw new AppError({
            code: "EXECUTION_MISSING_SOURCE",
            stage: "cli-parse",
            source: "execution-index",
            message: "Missing --source for data mode.",
        });
    }

    await runDataMode({
        source: args.source,
        schemaArg: args.schemaArg || undefined,
        iterations: args.iterations,
        parallel: args.parallel,
        verbose: args.verbose,
    });
}

async function runE2EModeFromCli(args: {
    excelPath: string;
    sheetName: string;
    selectedIds: string[];
    includeDisabled: boolean;
    iterations: number;
    parallel: number;
    verbose: boolean;
}): Promise<void> {
    if (!args.excelPath) {
        throw new AppError({
            code: "EXECUTION_MISSING_EXCEL",
            stage: "cli-parse",
            source: "execution-index",
            message: "Missing --excel",
        });
    }

    if (!args.sheetName) {
        throw new AppError({
            code: "EXECUTION_MISSING_SHEET",
            stage: "cli-parse",
            source: "execution-index",
            message: "Missing --sheet",
        });
    }

    await runE2EMode({
        excelPath: args.excelPath,
        sheetName: args.sheetName,
        selectedIds: args.selectedIds,
        includeDisabled: args.includeDisabled,
        iterations: args.iterations,
        parallel: args.parallel,
        verbose: args.verbose,
    });
}

async function main(): Promise<void> {
    const argv = normalizeArgv(process.argv.slice(2));
    const mode = normalizeMode(String(getArg(argv, "--mode") ?? "e2e"));

    if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
        if (mode === "data") {
            printDataModeHelp();
        } else {
            console.log(usage());
        }

        return;
    }

    const verbose = hasFlag(argv, "--verbose");
    setLogVerbose(verbose);

    const iterations = parseIterations(String(getArg(argv, "--iterations") ?? ""));
    const parallel = parseParallel(String(getArg(argv, "--parallel") ?? ""));

    if (mode === "data") {
        await runDataModeFromCli({
            source: normalizeSpaces(String(getArg(argv, "--source") ?? "")),
            schemaArg: normalizeSpaces(String(getArg(argv, "--schema") ?? "")),
            iterations,
            parallel,
            verbose,
        });

        return;
    }

    await runE2EModeFromCli({
        excelPath: normalizeSpaces(String(getArg(argv, "--excel") ?? "")),
        sheetName: normalizeSpaces(String(getArg(argv, "--sheet") ?? "")),
        selectedIds: parseScenarioFilter(String(getArg(argv, "--scenario") ?? "")),
        includeDisabled: hasFlag(argv, "--includeDisabled"),
        iterations,
        parallel,
        verbose,
    });
}

main().catch((error: unknown) => {
    if (error instanceof AppError) {
        emitFrameworkLog(
            LOG_LEVELS.ERROR,
            `❌ [${error.code ?? "APP_ERROR"}] ${error.message}`
        );

        if (error.stage || error.source) {
            emitFrameworkLog(
                LOG_LEVELS.ERROR,
                `Stage: ${error.stage ?? "unknown"} | Source: ${error.source ?? "unknown"}`
            );
        }

        if (error.context) {
            emitFrameworkLog(
                LOG_LEVELS.ERROR,
                `Context: ${JSON.stringify(error.context, null, 2)}`
            );
        }
    } else {
        emitFrameworkLog(
            LOG_LEVELS.ERROR,
            error instanceof Error ? error.message : String(error)
        );
    }

    process.exit(1);
});