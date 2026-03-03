// src/scanner/commands/generate.ts

import path from "node:path";
import { createLogger } from "../logger";
import { runElementsGenerator } from "../elements-generator/runner";
import { getArg, hasFlag } from "./argv";

export async function runGenerateCommand(args: string[]) {
    // args are already normalized in cli.ts,
    // but getArg/hasFlag also normalize internally (double safety)

    const verbose = hasFlag(args, "--verbose");
    const log = createLogger({ prefix: "[scanner]", verbose, withTimestamp: true });

    log.info("Command: generate");

    const mapsDir =
        getArg(args, "--mapsDir") ??
        path.join(process.cwd(), "src", "page-maps");

    const pagesDir =
        getArg(args, "--pagesDir") ??
        path.join(process.cwd(), "src", "pages");

    const stateDir =
        getArg(args, "--stateDir") ??
        path.join(process.cwd(), "src", ".scanner-state");

    const stateFile =
        getArg(args, "--stateFile") ??
        path.join(stateDir, "page-maps-state.json");

    const merge = hasFlag(args, "--merge");
    const changedOnly = hasFlag(args, "--changedOnly");
    const stateOnly = hasFlag(args, "--stateOnly");

    // scaffold ON by default, allow disabling
    const scaffold = !hasFlag(args, "--noScaffold");

    if (verbose) {
        log.debug(
            `Args: mapsDir=${mapsDir} pagesDir=${pagesDir} merge=${merge} changedOnly=${changedOnly} stateOnly=${stateOnly} scaffold=${scaffold}`
        );
    }

    await runElementsGenerator({
        mapsDir,
        pagesDir,
        stateDir,
        stateFile,
        merge,
        verbose,
        changedOnly,
        stateOnly,
        scaffold,
        log,
    });

    log.info("Generate complete ✅");
}