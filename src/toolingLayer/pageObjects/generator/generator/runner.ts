// src/toolingLayer/pageObjects/generator/generator/runner.ts

import { ensureDir } from "@utils/fs";
import {
    PAGE_MANIFEST_DIR,
    PAGE_MANIFEST_INDEX_FILE,
    PAGE_MANIFEST_PAGES_DIR,
} from "@utils/paths";
import type { GenOptions } from "./types";
import { buildRegistryEntry } from "./changeDetection";
import { buildPageGenerationContext } from "./pageGenerationContext";
import { loadPageMapFile, readAllPageMapFiles } from "./pageMapLoader";
import {
    buildPageManifestEntry,
    loadPageManifestEntry,
    pageKeyToManifestFile,
    removeMissingPageManifestEntries,
    saveManifestIndex,
    savePageManifestEntry,
} from "./pageManifest";
import {
    applyRegistryStatusToReports,
    buildRunSummary,
    type InvalidPageReport,
    type RepairPageReport,
    type RepairRunReport,
} from "./report";
import { generatePageRegistryFromManifest } from "./registry";
import { ensureScaffoldFiles } from "./scaffold";
import { syncAliasesGeneratedFile } from "./syncAliasesGenerated";
import { syncAliasesHumanFile } from "./syncAliasesHuman";
import { syncElementsTs } from "./syncElementsTs";
import { syncAliasesIntoPageObject } from "./pageObject";

export async function runElementsGenerator(
    opts: GenOptions
): Promise<RepairRunReport> {
    const log = opts.log;
    const registryLog = log.child("registry");
    const manifestLog = log.child("manifest");
    const endRun = log.time("elements-generator");

    ensureDir(PAGE_MANIFEST_DIR);
    ensureDir(PAGE_MANIFEST_PAGES_DIR);

    const mapFiles = readAllPageMapFiles(opts.mapsDir);
    const pageReports: RepairPageReport[] = [];
    const invalidPages: InvalidPageReport[] = [];
    const validPageKeys: string[] = [];
    let processed = 0;

    for (const file of mapFiles) {
        const loaded = loadPageMapFile(opts.mapsDir, file);
        const pageKey = loaded.pageMap.pageKey;

        const oldEntry = loadPageManifestEntry(
            pageKeyToManifestFile(PAGE_MANIFEST_PAGES_DIR, pageKey)
        );

        const context = buildPageGenerationContext({
            file,
            raw: loaded.raw,
            pageMap: loaded.pageMap,
            pageObjectsDir: opts.pageObjectsDir,
            oldHash: oldEntry?.source?.mapHash,
            changedOnly: opts.changedOnly,
        });

        if (context.invalidPage) {
            invalidPages.push(context.invalidPage);
            manifestLog.info(
                `Skipped invalid pageKey "${context.invalidPage.pageKey}": ${context.invalidPage.reason}`
            );
            continue;
        }

        if (!context.artifact || !context.scope) {
            invalidPages.push({
                pageKey,
                reason: `Missing page generation context for "${pageKey}"`,
            });
            continue;
        }

        validPageKeys.push(pageKey);
        buildRegistryEntry(pageKey, opts.pageObjectsDir);

        const report: RepairPageReport = {
            pageKey,
            changed: false,
            elementsStatus: "unchanged",
            aliasesGeneratedStatus: "unchanged",
            pageObjectStatus: "unchanged",
            registryStatus: "already-registered",
            scope: {
                platform: context.scope.platform,
                application: context.scope.application,
                product: context.scope.product,
                name: context.scope.name,
            },
        };

        if (context.shouldSkip) {
            pageReports.push(report);
            continue;
        }

        if (context.shouldScaffold) {
            ensureScaffoldFiles({
                pagesDir: opts.pageObjectsDir,
                pageMap: context.pageMap,
                verbose: opts.verbose,
                log,
            });
        }

        const elementsRes = syncElementsTs(
            context.artifact.elementsPath,
            context.pageMap
        );

        const generatedRes = syncAliasesGeneratedFile(
            context.artifact.aliasesGeneratedPath,
            context.pageMap,
            elementsRes.renameMap,
            elementsRes.addedKeys
        );

        syncAliasesHumanFile({
            aliasesHumanPath: context.artifact.aliasesHumanPath,
            renameMap: generatedRes.renameMap,
            newGeneratedKeys: generatedRes.addedKeys,
            log,
        });

        syncAliasesIntoPageObject({
            pageTsPath: context.artifact.pageObjectPath,
            elementsTsPath: context.artifact.elementsPath,
            aliasesTsPath: context.artifact.aliasesHumanPath,
        });

        const manifestEntryResult = buildPageManifestEntry({
            pageMap: context.pageMap,
            artifact: context.artifact,
            pageMapFilePath: loaded.absPath,
            mapHash: context.hash,
        });

        if (!manifestEntryResult.ok) {
            invalidPages.push({
                pageKey: manifestEntryResult.pageKey,
                reason: manifestEntryResult.reason,
            });
            manifestLog.info(
                `Skipped manifest save for "${manifestEntryResult.pageKey}": ${manifestEntryResult.reason}`
            );
            continue;
        }

        savePageManifestEntry(
            pageKeyToManifestFile(PAGE_MANIFEST_PAGES_DIR, pageKey),
            manifestEntryResult.entry
        );

        processed++;
        report.changed = true;
        report.elementsStatus = elementsRes.changed ? "generated" : "unchanged";
        report.aliasesGeneratedStatus = generatedRes.changed
            ? "generated"
            : "unchanged";
        report.pageObjectStatus = "synced";
        pageReports.push(report);
    }

    const removed = removeMissingPageManifestEntries(
        PAGE_MANIFEST_PAGES_DIR,
        validPageKeys
    );

    if (removed > 0) {
        manifestLog.info(
            `Removed ${removed} stale page manifest entr${removed === 1 ? "y" : "ies"}.`
        );
    }

    saveManifestIndex(PAGE_MANIFEST_INDEX_FILE, validPageKeys);
    manifestLog.info(`Manifest index updated: ${PAGE_MANIFEST_INDEX_FILE}`);

    const syncRes = generatePageRegistryFromManifest(
        PAGE_MANIFEST_DIR,
        opts.pageRegistryDir
    );

    applyRegistryStatusToReports(pageReports, syncRes);

    registryLog.info(`Registry synced from manifest: ${PAGE_MANIFEST_DIR}`);
    log.info(`Processed pages: ${processed}`);

    const summary = buildRunSummary({
        pagesScanned: mapFiles.length,
        pageReports,
        syncRes,
        invalidPages,
    });

    endRun();
    return summary;
}
