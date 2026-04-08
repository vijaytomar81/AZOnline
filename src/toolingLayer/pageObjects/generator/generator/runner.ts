// src/toolingLayer/pageObjects/generator/generator/runner.ts

import path from "node:path";

import { ensureDir } from "@utils/fs";
import type { GenOptions } from "./types";
import { buildRegistryEntry } from "./changeDetection";
import { buildPageGenerationContext } from "./pageGenerationContext";
import { readAllPageMapFiles, loadPageMapFile } from "./pageMapLoader";
import { ensureScaffoldFiles } from "./scaffold";
import { syncElementsTs } from "./syncElementsTs";
import { syncAliasesGeneratedFile } from "./syncAliasesGenerated";
import { syncAliasesHumanFile } from "./syncAliasesHuman";
import { syncAliasesIntoPageObject } from "./pageObject";
import {
    buildPageManifestEntry,
    loadPageManifestEntry,
    pageKeyToManifestFile,
    removeMissingPageManifestEntries,
    saveManifestIndex,
    savePageManifestEntry,
} from "./pageManifest";
import { generatePageRegistryFromManifest } from "./registry";
import {
    applyRegistryStatusToReports,
    buildRunSummary,
    type RepairPageReport,
    type RepairRunReport,
} from "./report";
import { PAGE_MANIFEST_DIR, PAGE_MANIFEST_INDEX_FILE, PAGE_MANIFEST_PAGES_DIR } from "@utils/paths";


export async function runElementsGenerator(opts: GenOptions): Promise<RepairRunReport> {
    const log = opts.log;
    const registryLog = log.child("registry");
    const manifestLog = log.child("manifest");
    const endRun = log.time("elements-generator");

    ensureDir(PAGE_MANIFEST_DIR);
    ensureDir(PAGE_MANIFEST_PAGES_DIR);

    const mapFiles = readAllPageMapFiles(opts.mapsDir);
    const pageReports: RepairPageReport[] = [];
    const validPageKeys: string[] = [];
    let processed = 0;

    for (const file of mapFiles) {
        const loaded = loadPageMapFile(opts.mapsDir, file);
        const oldEntry = loadPageManifestEntry(
            pageKeyToManifestFile(PAGE_MANIFEST_PAGES_DIR, loaded.pageMap.pageKey)
        );

        const context = buildPageGenerationContext({
            file,
            raw: loaded.raw,
            pageMap: loaded.pageMap,
            pageObjectsDir: opts.pageObjectsDir,
            oldHash: oldEntry?.mapHash,
            changedOnly: opts.changedOnly,
        });

        validPageKeys.push(context.pageMap.pageKey);
        buildRegistryEntry(context.pageMap.pageKey, opts.pageObjectsDir);

        const report: RepairPageReport = {
            pageKey: context.pageMap.pageKey,
            changed: false,
            elementsStatus: "unchanged",
            aliasesGeneratedStatus: "unchanged",
            pageObjectStatus: "unchanged",
            registryStatus: "already-registered",
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

        const elementsRes = syncElementsTs(context.artifact.elementsPath, context.pageMap);
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

        savePageManifestEntry(
            pageKeyToManifestFile(PAGE_MANIFEST_PAGES_DIR, context.pageMap.pageKey),
            buildPageManifestEntry({
                pageMap: context.pageMap,
                artifact: context.artifact,
                pageMapFilePath: loaded.absPath,
                mapHash: context.hash,
            })
        );

        processed++;
        report.changed = true;
        report.elementsStatus = elementsRes.changed ? "generated" : "unchanged";
        report.aliasesGeneratedStatus = generatedRes.changed ? "generated" : "unchanged";
        report.pageObjectStatus = "synced";
        pageReports.push(report);
    }

    const removed = removeMissingPageManifestEntries(PAGE_MANIFEST_PAGES_DIR, validPageKeys);
    if (removed > 0) {
        manifestLog.info(`Removed ${removed} stale page manifest entr${removed === 1 ? "y" : "ies"}.`);
    }

    saveManifestIndex(PAGE_MANIFEST_INDEX_FILE, validPageKeys);
    manifestLog.info(`Manifest index updated: ${PAGE_MANIFEST_INDEX_FILE}`);

    const syncRes = generatePageRegistryFromManifest(PAGE_MANIFEST_DIR, opts.pageRegistryDir);
    applyRegistryStatusToReports(pageReports, syncRes);

    registryLog.info(`Registry synced from manifest: ${PAGE_MANIFEST_DIR}`);
    log.info(`Processed pages: ${processed}`);

    const summary = buildRunSummary({
        pagesScanned: mapFiles.length,
        pageReports,
        syncRes,
    });

    endRun();
    return summary;
}