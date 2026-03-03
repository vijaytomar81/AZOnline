// src/page-scanner/commands/scan.ts

import path from "node:path";
import { createLogger } from "../logger";
import { scanPage } from "../scanner/runner";
import { getArg, hasFlag, required } from "./argv";

function usage() {
    return `
page-scanner scan

Usage:
  npm run scan -- --connectCdp <wsUrl> --pageKey <key> [options]
  node -r ts-node/register src/page-scanner/cli.ts scan --connectCdp <wsUrl> --pageKey <key> [options]

Required:
  --connectCdp <wsUrl>   CDP websocket URL
                         (example: ws://localhost:9222/devtools/browser/<id>)
  --pageKey <key>        Page key used as filename for the page-map json
                         (example: motor.car-details)

Optional:
  --outDir <path>        Output folder for page-maps
                         (default: src/page-scanner/page-maps)
  --tabIndex <n>         Which browser tab to scan (0-based)
                         (default: 0)
  --merge                Merge into existing <pageKey>.json (keeps keys stable)
                         (default: false)
  --verbose              Extra logs
  --logToFile            Write logs to file too
  --logFilePath <path>   Log file path
                         (default: page-scanner.log)
  --help, -h             Show this help

Examples:
  # Mac/Linux
  npm run scan -- --connectCdp "$CDP" --pageKey motor.car-details --merge --verbose

  # Windows PowerShell
  npm run scan -- --connectCdp "$CDP" --pageKey motor.car-details --merge --verbose
`.trim();
}

export async function runScanCommand(args: string[]) {
    const verbose = hasFlag(args, "--verbose");

    const logToFile = hasFlag(args, "--logToFile");
    const logFilePath =
        getArg(args, "--logFilePath") ??
        path.join(process.cwd(), "page-scanner.log");

    const log = createLogger({
        prefix: "[page-scanner]",
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
        getArg(args, "--outDir") ??
        path.join(process.cwd(), "src", "page-scanner", "page-maps");

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