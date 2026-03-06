// src/tools/page-elements-generator/cli.ts

import path from "node:path";

import { createLogger } from "../../utils/logger";
import { normalizeArgv, hasFlag, getArg } from "../../utils/argv";
import { usage } from "./elementGeneratorHelp";
import { runElementsGenerator } from "./generator/runner";

import {
    PAGE_SCANNER_MAPS_DIR,
    PAGES_DIR,
    PAGE_ELEMENTS_GENERATOR_STATE_DIR,
    PAGE_ELEMENTS_GENERATOR_LOG_FILE,
} from "../../utils/paths";

let log = createLogger({
    prefix: "[page-elements-generator]",
    verbose: true,
    withTimestamp: true,
});

function isHelp(argv: string[]) {
    const args = normalizeArgv(argv);
    return (
        args.length === 0 ||
        args[0] === "help" ||
        args.includes("--help") ||
        args.includes("-h")
    );
}

async function main() {
    const argv = normalizeArgv(process.argv.slice(2));

    // Allow either:
    //   node .../cli.ts --merge
    //   node .../cli.ts generate --merge
    const args = argv[0] === "generate" ? argv.slice(1) : argv;

    if (isHelp(args)) {
        log.info(usage());
        return;
    }

    const verbose = hasFlag(args, "--verbose");

    const logToFile = hasFlag(args, "--logToFile");
    const logFilePath =
        getArg(args, "--logFilePath") ?? PAGE_ELEMENTS_GENERATOR_LOG_FILE

    log = createLogger({
        prefix: "[page-elements-generator]",
        verbose,
        withTimestamp: true,
        logToFile,
        logFilePath,
    });

    log.info("Command: generate");

    const mapsDir =
        getArg(args, "--mapsDir") ?? PAGE_SCANNER_MAPS_DIR

    const pagesDir =
        getArg(args, "--pagesDir") ?? PAGES_DIR;

    const stateDir =
        getArg(args, "--stateDir") ?? PAGE_ELEMENTS_GENERATOR_STATE_DIR

    const stateFile =
        getArg(args, "--stateFile") ?? path.join(stateDir, "page-maps-state.json");

    const merge = hasFlag(args, "--merge");
    const changedOnly = hasFlag(args, "--changedOnly");
    const stateOnly = hasFlag(args, "--stateOnly");
    const scaffold = !hasFlag(args, "--noScaffold");

    if (verbose) {
        log.debug(
            `Args: mapsDir=${mapsDir} pagesDir=${pagesDir} stateDir=${stateDir} stateFile=${stateFile} merge=${merge} changedOnly=${changedOnly} stateOnly=${stateOnly} scaffold=${scaffold}`
        );
    }

    await runElementsGenerator({
        mapsDir,
        pagesDir,
        stateDir,
        stateFile,
        merge,
        changedOnly,
        stateOnly,
        scaffold,
        verbose,
        log,
    });

    log.info("Generate complete ✅");
}

main().catch((e) => {
    log.error(e?.message || String(e));
    process.exit(1);
});