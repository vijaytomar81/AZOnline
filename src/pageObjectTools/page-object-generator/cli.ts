// src/pageObjectTools/page-object-generator/cli.ts
import os from "node:os";
import path from "node:path";

import { createLogger } from "@utils/logger";
import { normalizeArgv, hasFlag, getArg } from "@utils/argv";
import { usage } from "./elementGeneratorHelp";
import { printCommandTitle } from "@utils/cliFormat";
import { runElementsGenerator } from "./generator/runner";
import {
    PAGE_MAPS_DIR,
    PAGE_OBJECTS_DIR,
    PAGE_REGISTRY_DIR,
    PAGE_OBJECT_GENERATOR_LOG_FILE,
} from "@utils/paths";

function buildRunLabel(): string {
    const host = os.hostname().replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase() || "unknown-host";
    return `${host}-${process.pid}-${Date.now().toString(36).slice(-6)}`;
}

const runLabel = buildRunLabel();

let log = createLogger({
    prefix: `[page-elements-generator][${runLabel}]`,
    logLevel: "info",
    withTimestamp: true,
});

function isHelp(argv: string[]): boolean {
    const args = normalizeArgv(argv);

    return (
        args.length === 0 ||
        args[0] === "help" ||
        args.includes("--help") ||
        args.includes("-h")
    );
}

async function main() {
    printCommandTitle("PAGE ELEMENTS GENERATOR", "elementsGeneratorIcon");

    const argv = normalizeArgv(process.argv.slice(2));
    const args = argv[0] === "generate" ? argv.slice(1) : argv;

    if (isHelp(args)) {
        log.info(usage());
        return;
    }

    const verbose = hasFlag(args, "--verbose");
    const logToFile = hasFlag(args, "--logToFile");
    const logFilePath = getArg(args, "--logFilePath") ?? PAGE_OBJECT_GENERATOR_LOG_FILE;

    log = createLogger({
        prefix: `[page-elements-generator][${runLabel}]`,
        logLevel: verbose ? "debug" : "info",
        withTimestamp: true,
        logToFile,
        logFilePath,
    });

    const mapsDir = getArg(args, "--mapsDir") ?? PAGE_MAPS_DIR;
    const pageObjectsDir = getArg(args, "--pageObjectsDir") ?? PAGE_OBJECTS_DIR;
    const pageRegistryDir = getArg(args, "--pageRegistryDir") ?? PAGE_REGISTRY_DIR;
    const merge = hasFlag(args, "--merge");
    const changedOnly = hasFlag(args, "--changedOnly");

    log.info("Command: generate");
    log.info(`Run label: ${runLabel}`);

    if (verbose) {
        log.debug(
            `Args:
mapsDir=${mapsDir}
pageObjectsDir=${pageObjectsDir}
pageRegistryDir=${pageRegistryDir}
merge=${merge}
changedOnly=${changedOnly}
logToFile=${logToFile}
logFilePath=${path.relative(process.cwd(), logFilePath)}`
        );
    }

    await runElementsGenerator({
        mapsDir,
        pageObjectsDir,
        pageRegistryDir,
        merge,
        changedOnly,
        verbose,
        log: log.child("runner"),
    });

    log.info("Generate complete ✅");
}

main().catch((e) => {
    log.error(e?.message || String(e));
    process.exit(1);
});