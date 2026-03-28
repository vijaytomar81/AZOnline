// src/execution/cli/main.ts

import { getArg, hasFlag, normalizeArgv } from "@utils/argv";
import { normalizeSpaces } from "@utils/text";
import { setLogVerbose } from "@logging/core/logConfig";
import { printDataModeHelp } from "@execution/modes/data/help";
import { usage } from "@execution/modes/e2e/help";
import {
    normalizeMode,
    parseIterations,
    parseScenarioFilter,
} from "@execution/runtime/cli";
import { handleExecutionError } from "./handleExecutionError";
import { parseParallel } from "./parseParallel";
import { runDataModeFromCli } from "./runDataModeFromCli";
import { runE2EModeFromCli } from "./runE2EModeFromCli";

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

main().catch(handleExecutionError);
