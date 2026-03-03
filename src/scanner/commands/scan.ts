// src/scanner/commands/scan.ts

import path from "node:path";
import { createLogger } from "../logger";
import { scanPage } from "../page-scanner/runner";
import { getArg, hasFlag, required } from "./argv";

function usage() {
    return `
scanner scan

Usage:
  ts-node src/scanner/cli.ts scan [options]

Required:
  --connectCdp <wsUrl>      e.g. ws://localhost:9222/devtools/browser/<id>
  --pageKey <key>           e.g. motor.car-details

Options:
  --outDir <path>           default: src/page-maps
  --tabIndex <n>            default: 0
  --merge                   merge into existing page-map json
  --verbose
  --logToFile
  --logFilePath <path>      default: scanner.log
  --help
`.trim();
}

export async function runScanCommand(args: string[]) {
    const verbose = hasFlag(args, "--verbose");

    const logToFile = hasFlag(args, "--logToFile");
    const logFilePath =
        getArg(args, "--logFilePath") ?? path.join(process.cwd(), "scanner.log");

    const log = createLogger({
        prefix: "[scanner]",
        verbose,
        withTimestamp: true,
        logToFile,
        logFilePath,
    });

    if (hasFlag(args, "--help") || hasFlag(args, "-h")) {
        log.info(usage());
        return;
    }

    const connectCdp = required("--connectCdp", getArg(args, "--connectCdp"));
    const pageKey = required("--pageKey", getArg(args, "--pageKey"));

    const outDir =
        getArg(args, "--outDir") ?? path.join(process.cwd(), "src", "page-maps");

    const tabIndexRaw = getArg(args, "--tabIndex");
    const tabIndex = tabIndexRaw ? Number(tabIndexRaw) : 0;
    if (!Number.isFinite(tabIndex) || tabIndex < 0) {
        throw new Error(`Invalid --tabIndex '${tabIndexRaw}'. Must be 0 or greater.`);
    }

    const merge = hasFlag(args, "--merge");

    if (verbose) {
        log.debug(
            `Args: pageKey=${pageKey} outDir=${outDir} merge=${merge} tabIndex=${tabIndex} connectCdp=${connectCdp}`
        );
    }

    log.info("Command: scan");

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