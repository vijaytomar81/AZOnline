// src/execution/index.ts

import { AppError } from "@utils/errors";
import { getArg, hasFlag, normalizeArgv } from "@utils/argv";
import { createLogger } from "@utils/logger";
import { normalizeSpaces } from "@utils/text";
import { printDataModeHelp } from "./modes/data/help";
import { usage } from "./modes/e2e/help";
import {
    normalizeMode,
    parseIterations,
    parseScenarioFilter,
} from "./runtime/cli";
import { runDataMode } from "./modes/data/runner";
import { runE2EMode } from "./modes/e2e/runner";

async function main(): Promise<void> {
    const argv = normalizeArgv(process.argv.slice(2));
    const mode = normalizeMode(String(getArg(argv, "--mode") ?? "e2e"));

    if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
        if (mode === "data") printDataModeHelp();
        else console.log(usage());
        return;
    }

    const verbose = hasFlag(argv, "--verbose");
    const iterations = parseIterations(String(getArg(argv, "--iterations") ?? ""));

    if (mode === "data") {
        const source = normalizeSpaces(String(getArg(argv, "--source") ?? ""));
        const schemaArg = normalizeSpaces(String(getArg(argv, "--schema") ?? ""));

        if (!source) {
            throw new AppError({
                code: "EXECUTION_MISSING_SOURCE",
                stage: "cli-parse",
                source: "execution-index",
                message: "Missing --source for data mode.",
            });
        }

        await runDataMode({
            source,
            schemaArg: schemaArg || undefined,
            iterations,
            verbose,
        });
        return;
    }

    const excelPath = normalizeSpaces(String(getArg(argv, "--excel") ?? ""));
    const sheetName = normalizeSpaces(String(getArg(argv, "--sheet") ?? ""));
    const selectedIds = parseScenarioFilter(String(getArg(argv, "--scenario") ?? ""));
    const includeDisabled = hasFlag(argv, "--includeDisabled");

    if (!excelPath) {
        throw new AppError({
            code: "EXECUTION_MISSING_EXCEL",
            stage: "cli-parse",
            source: "execution-index",
            message: "Missing --excel",
        });
    }

    if (!sheetName) {
        throw new AppError({
            code: "EXECUTION_MISSING_SHEET",
            stage: "cli-parse",
            source: "execution-index",
            message: "Missing --sheet",
        });
    }

    await runE2EMode({
        excelPath,
        sheetName,
        selectedIds,
        includeDisabled,
        iterations,
        verbose,
    });
}

main().catch((error: unknown) => {
    const log = createLogger({
        prefix: "[execution]",
        logLevel: "debug",
        withTimestamp: true,
        logToFile: false,
    });

    if (error instanceof AppError) {
        log.error(`❌ [${error.code ?? "APP_ERROR"}] ${error.message}`);
        if (error.stage || error.source) {
            log.error(
                `Stage: ${error.stage ?? "unknown"} | Source: ${error.source ?? "unknown"}`
            );
        }
        if (error.context) {
            log.error(`Context: ${JSON.stringify(error.context, null, 2)}`);
        }
    } else {
        log.error(error instanceof Error ? error.message : String(error));
    }

    process.exit(1);
});