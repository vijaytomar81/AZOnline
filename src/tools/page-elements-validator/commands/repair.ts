// src/tools/page-elements-validator/commands/repair.ts

import path from "node:path";
import { createLogger } from "../../../utils/logger";

// ✅ generator lives in page-elements-generator now
import { runElementsGenerator } from "../../page-elements-generator/generator/runner";

// ✅ validator CLI owns argv parsing (no ./argv file)
function normalizeArgv(argv: string[]): string[] {
    return argv.filter((a) => a !== "--");
}

function hasFlag(argv: string[], name: string): boolean {
    return normalizeArgv(argv).includes(name);
}

function getArg(argv: string[], name: string): string | undefined {
    const args = normalizeArgv(argv);

    const i = args.indexOf(name);
    if (i >= 0) {
        const v = args[i + 1];
        if (!v || v.startsWith("--")) return undefined;
        return v;
    }

    const eq = args.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return undefined;
}

export async function runRepairCommand(args: string[]) {
    const verbose = hasFlag(args, "--verbose");
    const log = createLogger({ prefix: "[validator - repair]", verbose, withTimestamp: true });

    log.info("Command: repair");

    // ✅ defaults updated to new folders
    const mapsDir =
        getArg(args, "--mapsDir") ??
        path.join(process.cwd(), "src", "tools", "page-scanner", "page-maps");

    const pagesDir =
        getArg(args, "--pagesDir") ?? path.join(process.cwd(), "src", "pages");

    const stateDir =
        getArg(args, "--stateDir") ??
        path.join(process.cwd(), "src", "tools", "page-elements-generator", ".state");

    const stateFile =
        getArg(args, "--stateFile") ?? path.join(stateDir, "page-maps-state.json");

    const merge = hasFlag(args, "--merge");
    const changedOnly = hasFlag(args, "--changedOnly");
    const stateOnly = hasFlag(args, "--stateOnly");

    // scaffold ON by default, allow disabling
    const scaffold = !hasFlag(args, "--noScaffold");

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