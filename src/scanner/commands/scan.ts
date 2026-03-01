// src/scanner/commands/scan.ts
import path from "node:path";
import { createLogger } from "../logger";
import { scanPage } from "../page-scanner/runner";

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

function required(name: string, value: string | undefined): string {
    if (!value) throw new Error(`${name} is required.`);
    return value;
}

export async function runScanCommand(argv: string[]) {
    const connectCdp = required("--connectCdp", getArg(argv, "--connectCdp"));
    const pageKey = required("--pageKey", getArg(argv, "--pageKey"));

    const outDir = getArg(argv, "--outDir") ?? path.join(process.cwd(), "src", "page-maps");

    const tabIndexRaw = getArg(argv, "--tabIndex");
    const tabIndex = tabIndexRaw ? Number(tabIndexRaw) : 0;
    if (!Number.isFinite(tabIndex) || tabIndex < 0) {
        throw new Error(`Invalid --tabIndex '${tabIndexRaw}'. Must be 0 or greater.`);
    }

    const merge = hasFlag(argv, "--merge");
    const verbose = hasFlag(argv, "--verbose");

    const logToFile = hasFlag(argv, "--logToFile");
    const logFilePath = getArg(argv, "--logFilePath") ?? path.join(process.cwd(), "scanner.log");

    const log = createLogger({
        prefix: "[scanner]",
        verbose,
        withTimestamp: true,
        logToFile,
        logFilePath,
    });

    log.info("Command: scan");
    log.debug(
        `Args: pageKey=${pageKey} outDir=${outDir} merge=${merge} tabIndex=${tabIndex}`
    );

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