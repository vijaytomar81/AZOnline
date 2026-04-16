// src/toolingLayer/pageObjects/generator/generator/finalizeGenerationRun.ts

import {
    PAGE_MANIFEST_DIR,
    PAGE_MANIFEST_INDEX_FILE,
} from "@utils/paths";
import {
    applyRegistryStatusToReports,
    buildRunSummary,
    printGenerationExecution,
    printGenerationSummary,
    type GenerationErrorReport,
    type InvalidPageReport,
    type RepairPageReport,
    type RepairRunReport,
} from "./report";
import { generatePageRegistryFromManifest } from "./registry";
import {
    removeMissingPageManifestEntries,
    saveManifestIndex,
} from "./pageManifest";
import type { GenOptions } from "./types";

type FinalizeGenerationRunArgs = {
    opts: GenOptions;
    pagesScanned: number;
    processed: number;
    pageReports: RepairPageReport[];
    invalidPages: InvalidPageReport[];
    errorPages: GenerationErrorReport[];
    validPageKeys: string[];
};

export function finalizeGenerationRun(
    args: FinalizeGenerationRunArgs
): RepairRunReport {
    const manifestLog = args.opts.log.child("manifest");
    const registryLog = args.opts.log.child("registry");

    const removed = removeMissingPageManifestEntries(
        PAGE_MANIFEST_DIR,
        args.validPageKeys
    );

    if (removed > 0) {
        manifestLog.info(
            `Removed ${removed} stale page manifest entr${removed === 1 ? "y" : "ies"}.`
        );
    }

    if (saveManifestIndex(PAGE_MANIFEST_INDEX_FILE, args.validPageKeys)) {
        manifestLog.info(`Manifest index updated: ${PAGE_MANIFEST_INDEX_FILE}`);
    }

    const syncRes = generatePageRegistryFromManifest(
        PAGE_MANIFEST_DIR,
        args.opts.pageRegistryDir
    );

    applyRegistryStatusToReports(args.pageReports, syncRes);

    registryLog.info(`Registry synced from manifest: ${PAGE_MANIFEST_DIR}`);
    args.opts.log.info(`Processed pages: ${args.processed}`);

    const summary = buildRunSummary({
        pagesScanned: args.pagesScanned,
        pagesProcessed: args.processed,
        pageReports: args.pageReports,
        syncRes,
        invalidPages: args.invalidPages,
        errorPages: args.errorPages,
    });

    printGenerationExecution(summary);
    printGenerationSummary(summary);

    return summary;
}
