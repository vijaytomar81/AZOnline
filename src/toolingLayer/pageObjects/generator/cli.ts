// src/toolingLayer/pageObjects/generator/cli.ts

import os from "node:os";
import path from "node:path";

import { createLogger } from "@utils/logger";
import { normalizeArgv, hasFlag, getArg } from "@utils/argv";
import { usage } from "./elementGeneratorHelp";
import {
    failure,
    printCommandTitle,
    success,
    printEnvironment,
} from "@utils/cliFormat";
import { runElementsGenerator } from "./generator/runner";
import {
    PAGE_MAPS_DIR,
    PAGE_OBJECTS_DIR,
    PAGE_REGISTRY_DIR,
    PAGE_OBJECT_GENERATOR_LOG_FILE,
} from "@utils/paths";

function buildRunLabel(): string {
    const host =
        os.hostname().replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase() ||
        "unknown-host";

    return `${host}-${process.pid}-${Date.now().toString(36).slice(-6)}`;
}

const runLabel = buildRunLabel();

let log = createLogger({
    prefix: `[page-elements-generator][${runLabel}]`,
    logLevel: "info",
    withTimestamp: true,
});

function shouldShowHelp(argv: string[]): boolean {
    const args = normalizeArgv(argv);

    if (args.length === 0) {
        return true;
    }

    if (args[0] === "help") {
        return true;
    }

    return args.includes("--help") || args.includes("-h");
}

function printGeneratorEnvironment(args: {
    mapsDir: string;
    pageObjectsDir: string;
    pageRegistryDir: string;
    logToFile: boolean;
    logFilePath: string;
    verbose: boolean;
}) {
    const rows: Array<[string, string | number | boolean]> = [
        ["mapsDir", args.mapsDir],
        ["pageObjectsDir", args.pageObjectsDir],
        ["pageRegistryDir", args.pageRegistryDir],
        ["logToFile", args.logToFile],
        ["verbose", args.verbose],
    ];

    if (args.logToFile) {
        rows.push([
            "logFilePath",
            path.relative(process.cwd(), args.logFilePath),
        ]);
    }

    printEnvironment(rows);
}

async function main() {
    printCommandTitle("PAGE ELEMENTS GENERATOR", "elementsGeneratorIcon");

    const argv = normalizeArgv(process.argv.slice(2));

    if (shouldShowHelp(argv)) {
        log.info(usage());
        return;
    }

    const args = argv[0] === "generate" ? argv.slice(1) : argv;

    const verbose = hasFlag(args, "--verbose");
    const logToFile = hasFlag(args, "--logToFile");
    const logFilePath =
        getArg(args, "--logFilePath") ?? PAGE_OBJECT_GENERATOR_LOG_FILE;

    log = createLogger({
        prefix: `[page-elements-generator][${runLabel}]`,
        logLevel: verbose ? "debug" : "info",
        withTimestamp: true,
        logToFile,
        logFilePath,
    });

    const mapsDir = getArg(args, "--mapsDir") ?? PAGE_MAPS_DIR;
    const pageObjectsDir =
        getArg(args, "--pageObjectsDir") ?? PAGE_OBJECTS_DIR;
    const pageRegistryDir =
        getArg(args, "--pageRegistryDir") ?? PAGE_REGISTRY_DIR;

    printGeneratorEnvironment({
        mapsDir,
        pageObjectsDir,
        pageRegistryDir,
        logToFile,
        logFilePath,
        verbose,
    });

    log.info("Command: generate");
    log.info(`Run label: ${runLabel}`);

    if (verbose) {
        log.debug("Generator arguments parsed");
    }

    const summary = await runElementsGenerator({
        mapsDir,
        pageObjectsDir,
        pageRegistryDir,
        verbose,
        log: log.child("runner"),
    });

    if (summary.exitCode > 0) {
        log.error(`Generate finished with errors ${failure("✖")}`);
        process.exit(summary.exitCode);
    }

    log.info(`Generate complete ${success("✅")}`);
}

main().catch((error) => {
    log.error(error?.message || String(error));
    process.exit(1);
});
