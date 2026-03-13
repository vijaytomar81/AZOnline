// src/tools/page-scanner/commands/scan.ts

import { createLogger } from "@/utils/logger";
import { scanPage } from "../scanner/runner";
import { getArg, hasFlag, required } from "@/utils/argv";
import { usage } from "../scannerHelp";
import { PAGE_MAPS_DIR, PAGE_SCANNER_LOG_FILE } from "@/utils/paths";

export async function runScanCommand(args: string[]) {
    const verbose = hasFlag(args, "--verbose");

    const logToFile = hasFlag(args, "--logToFile");
    const logFilePath =
        getArg(args, "--logFilePath") ?? PAGE_SCANNER_LOG_FILE

    const log = createLogger({
        prefix: "[page-scanner]",
        logLevel: verbose ? "debug" : "info",
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
        getArg(args, "--outDir") ?? PAGE_MAPS_DIR

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
        log: log.child("runner"),
    });

    log.info("Done ✅");
}