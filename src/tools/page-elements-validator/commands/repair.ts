// src/tools/page-elements-validator/commands/repair.ts

import path from "node:path";

import { createLogger } from "../../../utils/logger";
import { normalizeArgv, hasFlag, getArg } from "../../../utils/argv";

// ✅ generator lives in page-elements-generator now
import { runElementsGenerator } from "../../page-elements-generator/generator/runner";

export async function runRepairCommand(args: string[]) {
    const argv = normalizeArgv(args);

    const verbose = hasFlag(argv, "--verbose");
    const log = createLogger({
        prefix: "[validator - repair]",
        verbose,
        withTimestamp: true,
    });

    log.info("Command: repair");

    // ✅ defaults updated to new folders
    const mapsDir =
        getArg(argv, "--mapsDir") ??
        path.join(process.cwd(), "src", "tools", "page-scanner", "page-maps");

    const pagesDir =
        getArg(argv, "--pagesDir") ?? path.join(process.cwd(), "src", "pages");

    const stateDir =
        getArg(argv, "--stateDir") ??
        path.join(process.cwd(), "src", "tools", "page-elements-generator", ".state");

    const stateFile =
        getArg(argv, "--stateFile") ?? path.join(stateDir, "page-maps-state.json");

    const merge = hasFlag(argv, "--merge");
    const changedOnly = hasFlag(argv, "--changedOnly");
    const stateOnly = hasFlag(argv, "--stateOnly");

    // scaffold ON by default, allow disabling
    const scaffold = !hasFlag(argv, "--noScaffold");

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

    log.info("Repair complete ✅");
}