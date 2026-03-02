// src/scanner/commands/repair.ts

import path from "node:path";
import { createLogger } from "../logger";
import { runElementsGenerator } from "../elements-generator/runner";

function usage() {
    return `
scanner repair

Usage:
  ts-node src/scanner/cli.ts repair [options]

Options:
  --mapsDir <path>     default: src/page-maps
  --pagesDir <path>    default: src/pages
  --stateDir <path>    default: src/.scanner-state
  --stateFile <path>   default: <stateDir>/page-maps-state.json

  --merge              (forwarded to generator; informational)
  --changedOnly        only process changed page-maps BUT still recreates missing outputs
  --noScaffold         do not scaffold create-only files
  --stateOnly          update state file only (no elements.ts writes)
  --verbose
  --help

What it does:
  - Runs the elements generator in "repair mode" so missing outputs are recreated.
`.trim();
}

function getArg(argv: string[], name: string): string | undefined {
    const i = argv.indexOf(name);
    if (i >= 0) return argv[i + 1];

    const eq = argv.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return undefined;
}

function hasFlag(argv: string[], name: string) {
    return argv.includes(name);
}

export async function runRepairCommand(args: string[]) {
    const verbose = hasFlag(args, "--verbose");
    const log = createLogger({ prefix: "[scanner]", verbose, withTimestamp: true });

    if (hasFlag(args, "--help") || hasFlag(args, "-h")) {
        log.info(usage());
        return;
    }

    log.info("Command: repair");

    const mapsDir = getArg(args, "--mapsDir") ?? path.join(process.cwd(), "src", "page-maps");
    const pagesDir = getArg(args, "--pagesDir") ?? path.join(process.cwd(), "src", "pages");
    const stateDir = getArg(args, "--stateDir") ?? path.join(process.cwd(), "src", ".scanner-state");
    const stateFile = getArg(args, "--stateFile") ?? path.join(stateDir, "page-maps-state.json");

    const merge = hasFlag(args, "--merge");
    const changedOnly = hasFlag(args, "--changedOnly");
    const stateOnly = hasFlag(args, "--stateOnly");
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