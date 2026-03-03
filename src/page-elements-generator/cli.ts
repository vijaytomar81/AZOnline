// src/page-elements-generator/cli.ts

import path from "node:path";
import { createLogger } from "./logger";
import { usage } from "./elementGeneratorHelp";
import { runElementsGenerator } from "./generator/runner";

// --------------------------------------------------
// argv helpers (bulletproof against npm "--" tokens)
// --------------------------------------------------

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
        console.log(usage());
        return;
    }

    const verbose = hasFlag(args, "--verbose");

    const logToFile = hasFlag(args, "--logToFile");
    const logFilePath =
        getArg(args, "--logFilePath") ??
        path.join(process.cwd(), "page-elements-generator.log");

    const log = createLogger({
        prefix: "[page-elements-generator]",
        verbose,
        withTimestamp: true,
        logToFile,
        logFilePath,
    });

    log.info("Command: generate");

    const mapsDir =
        getArg(args, "--mapsDir") ??
        path.join(process.cwd(), "src", "page-scanner", "page-maps");

    const pagesDir =
        getArg(args, "--pagesDir") ?? path.join(process.cwd(), "src", "pages");

    const stateDir =
        getArg(args, "--stateDir") ??
        path.join(process.cwd(), "src", "page-elements-generator", ".state");

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
    const log = createLogger({
        prefix: "[page-elements-generator]",
        verbose: true,
        withTimestamp: true,
    });
    log.error(e?.message || String(e));
    process.exit(1);
});