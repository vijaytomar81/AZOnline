// src/scanner/cli.ts

import path from "node:path";
import { createLogger } from "./logger";
import { scanPage } from "./scanPage";

function getArg(name: string): string | undefined {
    const argv = process.argv.slice(2);

    const i = argv.indexOf(name);
    if (i >= 0) return argv[i + 1];

    const eq = argv.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return undefined;
}

function hasFlag(name: string): boolean {
    return process.argv.slice(2).includes(name);
}

function required(name: string, value: string | undefined): string {
    if (!value) throw new Error(`${name} is required.`);
    return value;
}

async function main() {
    const connectCdp = required("--connectCdp", getArg("--connectCdp"));
    const pageKey = required("--pageKey", getArg("--pageKey"));

    const outDir =
        getArg("--outDir") ?? path.join(process.cwd(), "src", "page-maps");

    const tabIndexRaw = getArg("--tabIndex");
    const tabIndex = tabIndexRaw ? Number(tabIndexRaw) : 0;
    if (!Number.isFinite(tabIndex) || tabIndex < 0) {
        throw new Error(`Invalid --tabIndex '${tabIndexRaw}'. Must be 0 or greater.`);
    }

    const merge = hasFlag("--merge");
    const verbose = hasFlag("--verbose");

    const logToFile = hasFlag("--logToFile");
    const logFilePath =
        getArg("--logFilePath") ?? path.join(process.cwd(), "scanner.log");

    const log = createLogger({
        prefix: "[scanner]",
        verbose,
        withTimestamp: true, // default TRUE (same as data-builder)
        logToFile,
        logFilePath,
    });

    log.info("Starting scanner...");
    log.debug(`Args: pageKey=${pageKey} outDir=${outDir} merge=${merge} tabIndex=${tabIndex}`);

    await scanPage({
        connectCdp,
        pageKey,
        outDir,
        merge,
        tabIndex,
        verbose,
        log,
    });

    log.info("Done ✅");
}

main().catch((e) => {
    const log = createLogger({
        prefix: "[scanner]",
        verbose: true,
        withTimestamp: true,
    });

    log.error(e?.message || String(e));
    process.exit(1);
});