// src/tools/page-object-generator/generator/runner.ts

import fs from "node:fs";
import path from "node:path";

import { ensureDir } from "@/utils/fs";
import { PAGE_OBJECTS_MANIFEST_FILE } from "@/utils/paths";

import type { GenOptions } from "./types";
import { buildElementsTs } from "../builders/buildElementsTs";
import { generatePageRegistryFromManifest } from "./registry";
import type { PageRegistryEntry } from "./registry";
import { readAllPageMapFiles, loadPageMapFile } from "./pageMapLoader";
import { buildRegistryEntry } from "./changeDetection";
import {
    applyRegistryStatusToReports,
    buildRunSummary,
    type RepairPageReport,
    type RepairRunReport,
} from "./report";
import { ensureScaffoldFiles } from "./scaffold";
import { loadState, saveState } from "./state";
import { buildPageGenerationContext } from "./pageGenerationContext";
import {
    buildPageManifestEntry,
    loadPageManifest,
    removeMissingPagesFromManifest,
    savePageManifest,
    upsertPageManifestEntry,
} from "./pageManifest";

export async function runElementsGenerator(opts: GenOptions): Promise<RepairRunReport> {
    const log = opts.log;

    const scaffoldLog = log.child("scaffold");
    const registryLog = log.child("registry");
    const stateLog = log.child("state");
    const manifestLog = log.child("manifest");
    const endRun = log.time("elements-generator");

    const scaffold = opts.scaffold !== false;
    const scaffoldIfMissing = opts.scaffoldIfMissing !== false;

    const stateDir = opts.stateDir ?? path.join(process.cwd(), "src", ".scanner-state");
    ensureDir(stateDir);

    const stateFilePath = opts.stateFile ?? path.join(stateDir, "page-maps-state.json");

    const oldState = loadState(stateFilePath);
    const newState: Record<string, string> = {};

    const manifest = loadPageManifest(PAGE_OBJECTS_MANIFEST_FILE);

    const mapFiles = readAllPageMapFiles(opts.mapsDir);
    log.info(`Found ${mapFiles.length} page-map(s).`);

    let processed = 0;
    const registryEntries: PageRegistryEntry[] = [];
    const pageReports: RepairPageReport[] = [];
    const validPageKeys: string[] = [];

    for (const file of mapFiles) {
        const loaded = loadPageMapFile(opts.mapsDir, file);

        const context = buildPageGenerationContext({
            file,
            raw: loaded.raw,
            pageMap: loaded.pageMap,
            pageObjectsDir: opts.pageObjectsDir,
            oldHash: oldState[file],
            changedOnly: opts.changedOnly,
            scaffold,
            scaffoldIfMissing,
        });

        newState[file] = context.hash;
        validPageKeys.push(context.pageMap.pageKey);

        registryEntries.push(
            buildRegistryEntry(context.pageMap.pageKey, opts.pageObjectsDir)
        );

        const manifestEntry = buildPageManifestEntry({
            pageMap: context.pageMap,
            artifact: context.artifact,
            pageMapFilePath: loaded.absPath,
            mapHash: context.hash,
        });

        upsertPageManifestEntry({
            manifest,
            entry: manifestEntry,
        });

        const report: RepairPageReport = {
            pageKey: context.pageMap.pageKey,
            changed: false,
            elementsStatus: context.changed || context.missingOutputs ? "generated" : "unchanged",
            aliasesGeneratedStatus: context.missingOutputs ? "generated" : "unchanged",
            pageObjectStatus: context.aliasSyncNeeded
                ? "synced"
                : context.missingOutputs
                    ? "generated"
                    : "unchanged",
            registryStatus: "already-registered",
        };

        if (context.shouldSkip) {
            if (opts.verbose) {
                log.debug(`UNCHANGED → skipping ${file}`);
            }
            pageReports.push(report);
            continue;
        }

        if (context.shouldScaffold) {
            ensureScaffoldFiles({
                pagesDir: opts.pageObjectsDir,
                pageMap: context.pageMap,
                verbose: opts.verbose,
                log: scaffoldLog,
            });
        }

        if (opts.stateOnly) {
            if (opts.verbose) {
                log.debug(`STATE-ONLY → skipping elements write for ${context.pageMap.pageKey}`);
            }

            processed++;
            report.changed = true;
            pageReports.push(report);
            continue;
        }

        const ts = buildElementsTs(context.pageMap);

        if (opts.merge && fs.existsSync(context.artifact.elementsPath)) {
            log.info(`Merging (overwrite-safe): ${context.artifact.elementsPath}`);
        } else {
            log.info(`Writing: ${context.artifact.elementsPath}`);
        }

        fs.mkdirSync(path.dirname(context.artifact.elementsPath), { recursive: true });
        fs.writeFileSync(context.artifact.elementsPath, ts, "utf8");

        processed++;
        report.changed = true;
        pageReports.push(report);
    }

    const removedManifestPages = removeMissingPagesFromManifest({
        manifest,
        validPageKeys,
    });

    if (removedManifestPages > 0) {
        manifestLog.info(
            `Removed ${removedManifestPages} stale page manifest entr${removedManifestPages === 1 ? "y" : "ies"}.`
        );
    }

    const endManifestSave = manifestLog.time("save-page-manifest");
    savePageManifest(PAGE_OBJECTS_MANIFEST_FILE, manifest);
    endManifestSave();

    manifestLog.info(`Page manifest updated: ${PAGE_OBJECTS_MANIFEST_FILE}`);

    const endRegistrySync = registryLog.time("generate-page-registry-from-manifest");
    const syncRes = generatePageRegistryFromManifest(
        PAGE_OBJECTS_MANIFEST_FILE,
        opts.pageRegistryDir
    );
    endRegistrySync();

    applyRegistryStatusToReports(pageReports, syncRes);

    const endStateSave = stateLog.time("save-state");
    saveState(stateFilePath, newState);
    endStateSave();

    stateLog.info(`State file updated: ${stateFilePath}`);
    log.info(`Processed pages: ${processed}`);

    const summary = buildRunSummary({
        pagesScanned: mapFiles.length,
        pageReports,
        syncRes,
    });

    endRun();

    return {
        ...summary,
        stateUpdated: true,
    };
}