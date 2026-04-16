// src/toolingLayer/pageScanner/commands/scan.ts

import { getArg, hasFlag, required } from "@utils/argv";
import {
    printEnvironment,
    printSection,
    printSummary,
} from "@utils/cliFormat";
import { printTree } from "@utils/cliTree";
import { createLogger } from "@utils/logger";
import {
    PAGE_SCANNER_DIR,
    PAGE_SCANNER_LOG_FILE,
} from "@utils/paths";
import { parsePageKey } from "../scanner/pageKey/parsePageKey";
import { buildScanReportTree } from "../scanner/reporting/buildScanReportTree";
import { buildScanResultText } from "../scanner/reporting/buildScanResultText";
import { buildScanSummaryRows } from "../scanner/reporting/buildScanSummaryRows";
import type { ScanPageResult } from "../scanner/reporting/types";
import { scanPage } from "../scanner/runner";
import { usage } from "../scannerHelp";

function failedResult(pageKey: string, message: string): ScanPageResult {
    return {
        pageKey,
        operation: "failed",
        outFile: "",
        elementsFound: 0,
        diff: { added: [], updated: [], removed: [], unchanged: [] },
        errorMessage: message,
    };
}

export async function runScanCommand(args: string[]) {
    const verbose = hasFlag(args, "--verbose");
    const logToFile = hasFlag(args, "--logToFile");
    const logFilePath = getArg(args, "--logFilePath") ?? PAGE_SCANNER_LOG_FILE;

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
    const outDir = getArg(args, "--outDir") ?? PAGE_SCANNER_DIR;
    const tabIndexRaw = getArg(args, "--tabIndex");
    const tabIndex = tabIndexRaw ? Number(tabIndexRaw) : 0;

    if (!Number.isFinite(tabIndex) || tabIndex < 0) {
        throw new Error(`Invalid --tabIndex '${tabIndexRaw}'. Must be 0 or greater.`);
    }

    printEnvironment([
        ["connectCdp", connectCdp],
        ["outDir", outDir],
        ["tabIndex", tabIndex],
        ["logToFile", logToFile],
        ["verbose", verbose],
    ]);

    log.info("Command: scan");

    let result: ScanPageResult;

    try {
        parsePageKey(pageKey);

        result = await scanPage({
            connectCdp,
            pageKey,
            outDir,
            tabIndex,
            verbose,
            log: log.child("runner"),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        log.error(message);
        result = failedResult(pageKey, message);
    }

    printSection("Scan result");
    printTree(buildScanReportTree(result));

    printSummary(
        "SCAN SUMMARY",
        buildScanSummaryRows(result).map((row) => [row.label, row.value]),
        buildScanResultText(result)
    );

    if (result.operation === "failed") {
        process.exit(1);
    }

    log.info("Done ✅");
}
