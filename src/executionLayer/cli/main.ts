// src/executionLayer/cli/main.ts

import { getArg, hasFlag, normalizeArgv } from "@utils/argv";
import { normalizeSpaces } from "@utils/text";
import { setLogVerbose } from "@logging/core/logConfig";
import { printDataModeHelp, runDataMode } from "@executionLayer/mode/data";
import { printE2EModeHelp, runE2EMode } from "@executionLayer/mode/e2e";
import { parseParallel } from "./parseParallel";
import { parseApplication, parseProduct } from "./parseRoutingArgs";
import { handleExecutionError } from "./handleExecutionError";

function normalizeMode(raw?: string): "data" | "e2e" {
    return String(raw ?? "e2e").trim().toLowerCase() === "data"
        ? "data"
        : "e2e";
}

function parseIterations(raw?: string): number {
    const value = normalizeSpaces(String(raw ?? ""));

    if (!value) {
        return 1;
    }

    const num = Number(value);

    if (!Number.isInteger(num) || num <= 0) {
        return 1;
    }

    return num;
}

function parseScenarioFilter(raw?: string): string[] {
    return String(raw ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

async function main(): Promise<void> {
    const argv = normalizeArgv(process.argv.slice(2));
    const mode = normalizeMode(String(getArg(argv, "--mode") ?? "e2e"));

    if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
        if (mode === "data") {
            printDataModeHelp();
        } else {
            printE2EModeHelp();
        }

        return;
    }

    const verbose = hasFlag(argv, "--verbose");
    setLogVerbose(verbose);

    const iterations = parseIterations(String(getArg(argv, "--iterations") ?? ""));
    const parallel = parseParallel(String(getArg(argv, "--parallel") ?? ""));
    const application = parseApplication(String(getArg(argv, "--app") ?? ""));
    const product = parseProduct(String(getArg(argv, "--product") ?? ""));

    if (mode === "data") {
        await runDataMode({
            source: normalizeSpaces(String(getArg(argv, "--source") ?? "")),
            schemaArg: normalizeSpaces(String(getArg(argv, "--schema") ?? "")),
            iterations,
            parallel,
            verbose,
            application,
            product,
        });

        return;
    }

    await runE2EMode({
        excelPath: normalizeSpaces(String(getArg(argv, "--excel") ?? "")),
        sheetName: normalizeSpaces(String(getArg(argv, "--sheet") ?? "")),
        selectedIds: parseScenarioFilter(String(getArg(argv, "--scenario") ?? "")),
        includeDisabled: hasFlag(argv, "--includeDisabled"),
        iterations,
        parallel,
        verbose,
        application,
        product,
    });
}

main().catch(handleExecutionError);
