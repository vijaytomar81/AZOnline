// src/tools/page-elements-generator/generator/runner.ts

import fs from "node:fs";
import path from "node:path";

import type { GenOptions, PageMap } from "./types";
import { buildElementsTs } from "../builders/buildElementsTs";
import { syncPageRegistry } from "./syncPageRegistry";
import type { PageRegistryEntry } from "./syncPageRegistry";
import { toPascal } from "../../../utils/ts";
import { ensureScaffoldFiles, hasMissingGeneratedOutputs } from "./scaffold";
import { hashContent, loadState, saveState } from "./state";
import { ensureDir } from "../../../utils/fs";
import {
    mapPageKeyToAliasesHumanPath,
    mapPageKeyToElementsPath,
    mapPageKeyToPageTsPath,
} from "./paths";

function readAllPageMaps(mapsDir: string): string[] {
    return fs
        .readdirSync(mapsDir)
        .filter((f) => f.endsWith(".json") && !f.startsWith("."))
        .sort((a, b) => a.localeCompare(b));
}

function mtimeMsSafe(p: string): number {
    try {
        return fs.statSync(p).mtimeMs;
    } catch {
        return 0;
    }
}

/**
 * If aliases.ts changed (human renamed keys), we must re-sync the page object region
 * even when the page-map JSON hash did not change.
 */
function needsAliasSync(params: { pagesDir: string; pageKey: string }): boolean {
    const { pagesDir, pageKey } = params;

    const aliasesHumanPath = mapPageKeyToAliasesHumanPath(pagesDir, pageKey);
    const pageTsPath = mapPageKeyToPageTsPath(pagesDir, pageKey);

    if (!fs.existsSync(aliasesHumanPath) || !fs.existsSync(pageTsPath)) return false;

    // If aliases.ts is newer than page object, likely human edits need re-sync
    return mtimeMsSafe(aliasesHumanPath) > mtimeMsSafe(pageTsPath);
}

function buildRegistryEntry(pageKey: string): PageRegistryEntry {
    const lastSeg = pageKey.split(".").slice(-1)[0] || "Page";
    return {
        pageKey,
        className: `${toPascal(lastSeg)}Page`,
    };
}

export async function runElementsGenerator(opts: GenOptions) {
    const log = opts.log;

    const scaffold = opts.scaffold !== false; // default true
    const scaffoldIfMissing = opts.scaffoldIfMissing !== false; // default true

    const stateDir = opts.stateDir ?? path.join(process.cwd(), "src", ".scanner-state");
    ensureDir(stateDir);

    const stateFilePath = opts.stateFile ?? path.join(stateDir, "page-maps-state.json");

    const oldState = loadState(stateFilePath);
    const newState: Record<string, string> = {};

    const mapFiles = readAllPageMaps(opts.mapsDir);
    log.info(`Found ${mapFiles.length} page-map(s).`);

    let processed = 0;
    const registryEntries: PageRegistryEntry[] = [];

    for (const file of mapFiles) {
        const abs = path.join(opts.mapsDir, file);
        const raw = fs.readFileSync(abs, "utf8");

        const hash = hashContent(raw);
        newState[file] = hash;

        const oldHash = oldState[file];
        const changed = oldHash !== hash;

        const pageMap = JSON.parse(raw) as PageMap;
        if (!pageMap?.pageKey) throw new Error(`Invalid page-map (missing pageKey): ${file}`);
        if (!pageMap?.elements || typeof pageMap.elements !== "object") {
            throw new Error(`Invalid page-map (missing elements): ${file}`);
        }

        registryEntries.push(buildRegistryEntry(pageMap.pageKey));

        // Even with --changedOnly, we must re-create missing outputs
        const missingOutputs = hasMissingGeneratedOutputs({
            pagesDir: opts.pagesDir,
            pageKey: pageMap.pageKey,
        });

        // Decide whether we will scaffold on this run:
        // - normal scaffolding (opts.scaffold default true)
        // - OR if outputs are missing and scaffoldIfMissing is enabled
        const shouldScaffold = scaffold || (missingOutputs && scaffoldIfMissing);

        // Even with --changedOnly, we must re-sync page object when aliases.ts changed
        const aliasSyncNeeded =
            shouldScaffold &&
            needsAliasSync({
                pagesDir: opts.pagesDir,
                pageKey: pageMap.pageKey,
            });

        const shouldSkip = opts.changedOnly && !changed && !missingOutputs && !aliasSyncNeeded;
        if (shouldSkip) {
            if (opts.verbose) log.debug(`UNCHANGED → skipping ${file}`);
            continue;
        }

        // Scaffold (create-only + append new alias mappings + sync page object region)
        if (shouldScaffold) {
            ensureScaffoldFiles({
                pagesDir: opts.pagesDir,
                pageMap,
                verbose: opts.verbose,
                log,
            });
        }

        // State-only: do not write elements.ts (but state must still update)
        if (opts.stateOnly) {
            if (opts.verbose) log.debug(`STATE-ONLY → skipping elements write for ${pageMap.pageKey}`);
            processed++;
            continue;
        }

        // elements.ts is always regenerated (overwrite-safe)
        const elementsPath = mapPageKeyToElementsPath(opts.pagesDir, pageMap.pageKey);
        const ts = buildElementsTs(pageMap);

        if (opts.merge && fs.existsSync(elementsPath)) {
            log.info(`Merging (overwrite-safe): ${elementsPath}`);
        } else {
            log.info(`Writing: ${elementsPath}`);
        }

        fs.mkdirSync(path.dirname(elementsPath), { recursive: true });
        fs.writeFileSync(elementsPath, ts, "utf8");

        processed++;
    }

    const syncRes = syncPageRegistry(registryEntries, opts.pagesDir);

    if (syncRes.index.changed) {
        log.info(`pages/index.ts updated with ${syncRes.index.added.length} export(s)`);
    }

    if (syncRes.pageManager.changed) {
        log.info(
            `pages/pageManager.ts updated with ${syncRes.pageManager.addedImports.length} import(s) and ${syncRes.pageManager.addedEntries.length} page entry(s)`
        );
    }

    // always update state
    saveState(stateFilePath, newState);

    log.info(`State file updated: ${stateFilePath}`);
    log.info(`Processed pages: ${processed}`);
}