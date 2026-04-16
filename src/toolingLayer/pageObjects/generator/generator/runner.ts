// src/toolingLayer/pageObjects/generator/generator/runner.ts

import { ensureDir } from "@utils/fs";
import { PAGE_MANIFEST_DIR } from "@utils/paths";
import { loadPageMapFile, readAllPageMapFiles } from "./pageMapLoader";
import {
    buildPageManifestEntry,
    pageKeyToManifestFile,
    savePageManifestEntry,
} from "./pageManifest";
import { finalizeGenerationRun } from "./finalizeGenerationRun";
import { processPageGeneration } from "./processPageGeneration";
import type {
    GenerationErrorReport,
    InvalidPageReport,
    RepairPageReport,
    RepairRunReport,
} from "./report";
import type { GenOptions } from "./types";

export async function runElementsGenerator(
    opts: GenOptions
): Promise<RepairRunReport> {
    const endRun = opts.log.time("elements-generator");
    ensureDir(PAGE_MANIFEST_DIR);

    const mapFiles = readAllPageMapFiles(opts.mapsDir);
    const pageReports: RepairPageReport[] = [];
    const invalidPages: InvalidPageReport[] = [];
    const errorPages: GenerationErrorReport[] = [];
    const validPageKeys: string[] = [];
    let processed = 0;

    for (const file of mapFiles) {
        const loaded = loadPageMapFile(opts.mapsDir, file);

        const result = processPageGeneration({
            file,
            raw: loaded.raw,
            absPath: loaded.absPath,
            pageMap: loaded.pageMap,
            opts,
            manifestRoot: PAGE_MANIFEST_DIR,
            pageKeyToManifestFile,
            buildPageManifestEntry,
            savePageManifestEntry,
        });

        if (result.validPageKey) {
            validPageKeys.push(result.validPageKey);
        }

        if (result.pageReport) {
            pageReports.push(result.pageReport);
        }

        if (result.invalidPage) {
            invalidPages.push(result.invalidPage);
            opts.log.child("manifest").info(
                `Skipped invalid pageKey "${result.invalidPage.pageKey}": ${result.invalidPage.reason}`
            );
        }

        if (result.errorPage) {
            errorPages.push(result.errorPage);
            opts.log.error(
                `Failed to process page "${result.errorPage.pageKey}": ${result.errorPage.reason}`
            );
        }

        if (result.processed) {
            processed++;
        }
    }

    const summary = finalizeGenerationRun({
        opts,
        pagesScanned: mapFiles.length,
        processed,
        pageReports,
        invalidPages,
        errorPages,
        validPageKeys,
    });

    endRun();
    return summary;
}
