// src/scanner/commands/generate.ts

import path from "node:path";
import { createLogger } from "../logger";
import { runElementsGenerator } from "../elements-generator/runner";

function getArg(argv: string[], name: string): string | undefined {
    const i = argv.indexOf(name);
    if (i >= 0) return argv[i + 1];

    const eq = argv.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return undefined;
}

function hasFlag(argv: string[], name: string): boolean {
    return argv.includes(name);
}

export async function runGenerateCommand(args: string[]) {
    const verbose = hasFlag(args, "--verbose");
    const log = createLogger({ prefix: "[scanner]", verbose, withTimestamp: true });

    log.info("Command: generate");

    const mapsDir = getArg(args, "--mapsDir") ?? path.join(process.cwd(), "src", "page-maps");
    const pagesDir = getArg(args, "--pagesDir") ?? path.join(process.cwd(), "src", "pages");

    const stateDir = getArg(args, "--stateDir") ?? path.join(process.cwd(), "src", ".scanner-state");
    const stateFile =
        getArg(args, "--stateFile") ?? path.join(stateDir, "page-maps-state.json");

    const merge = hasFlag(args, "--merge");
    const changedOnly = hasFlag(args, "--changedOnly");
    const stateOnly = hasFlag(args, "--stateOnly");

    // generator: scaffold ON by default, allow disabling
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