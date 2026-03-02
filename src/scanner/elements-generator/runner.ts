// src/scanner/elements-generator/runner.ts

import fs from "node:fs";
import path from "node:path";

import type { GenOptions, PageMap, StateFile } from "./types";
import { buildElementsTs } from "./builders/buildElementsTs";
import { mapPageKeyToElementsPath } from "./paths";
import { ensureScaffoldFiles, hasMissingGeneratedOutputs } from "./scaffold";
import { ensureDir, hashContent, loadState, saveState } from "./state";

function listPageMapFiles(mapsDir: string): string[] {
    if (!fs.existsSync(mapsDir)) return [];
    return fs
        .readdirSync(mapsDir)
        .filter((f) => f.endsWith(".json") && !f.startsWith("."))
        .sort((a, b) => a.localeCompare(b));
}

function readPageMap(absPath: string, fileNameForErrors: string): PageMap {
    const raw = fs.readFileSync(absPath, "utf8");
    const pageMap = JSON.parse(raw) as PageMap;

    if (!pageMap?.pageKey) throw new Error(`Invalid page-map (missing pageKey): ${fileNameForErrors}`);
    if (!pageMap?.elements || typeof pageMap.elements !== "object") {
        throw new Error(`Invalid page-map (missing elements): ${fileNameForErrors}`);
    }

    return pageMap;
}

export async function runElementsGenerator(opts: GenOptions) {
    const log = opts.log;
    const scaffold = opts.scaffold !== false; // default true

    const stateDir = opts.stateDir ?? path.join(process.cwd(), "src", ".scanner-state");
    ensureDir(stateDir);

    const stateFilePath = opts.stateFile ?? path.join(stateDir, "page-maps-state.json");

    const oldState: StateFile = loadState(stateFilePath);
    const newState: StateFile = {};

    const mapFiles = listPageMapFiles(opts.mapsDir);
    log.info(`Found ${mapFiles.length} page-map(s).`);

    let processed = 0;

    for (const file of mapFiles) {
        const abs = path.join(opts.mapsDir, file);
        const raw = fs.readFileSync(abs, "utf8");

        const hash = hashContent(raw);
        newState[file] = hash;

        const oldHash = oldState[file];
        const changed = oldHash !== hash;

        const pageMap = readPageMap(abs, file);

        // ✅ even with --changedOnly, re-run if outputs are missing
        const missingOutputs = hasMissingGeneratedOutputs({
            pagesDir: opts.pagesDir,
            pageKey: pageMap.pageKey,
        });

        const shouldSkip = opts.changedOnly && !changed && !missingOutputs;
        if (shouldSkip) {
            if (opts.verbose) log.debug(`UNCHANGED → skipping ${file}`);
            continue;
        }

        // Scaffold (create-only files + regenerate aliases.generated + sync page methods)
        if (scaffold) {
            ensureScaffoldFiles({
                pagesDir: opts.pagesDir,
                pageMap,
                verbose: opts.verbose,
                log,
            });
        }

        // State-only: do not write elements.ts (but still update state)
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

        ensureDir(path.dirname(elementsPath));
        fs.writeFileSync(elementsPath, ts, "utf8");

        processed++;
    }

    // always update state file
    saveState(stateFilePath, newState);

    log.info(`State file updated: ${stateFilePath}`);
    log.info(`Processed pages: ${processed}`);
}