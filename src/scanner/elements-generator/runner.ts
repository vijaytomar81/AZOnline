// src/scanner/elements-generator/runner.ts

import fs from "node:fs";
import path from "node:path";

import type { GenOptions, PageMap } from "./types";
import { buildElementsTs } from "./builders/buildElementsTs";
import { mapPageKeyToElementsPath } from "./paths";
import { ensureScaffoldFiles, hasMissingGeneratedOutputs } from "./scaffold";
import { hashContent, loadState, saveState, ensureDir } from "./state";

function readAllPageMaps(mapsDir: string): string[] {
    return fs
        .readdirSync(mapsDir)
        .filter((f) => f.endsWith(".json") && !f.startsWith("."));
}

export async function runElementsGenerator(opts: GenOptions) {
    const log = opts.log;

    const scaffold = opts.scaffold !== false; // default true

    const stateDir = opts.stateDir ?? path.join(process.cwd(), "src", ".scanner-state");
    ensureDir(stateDir);

    const stateFilePath = opts.stateFile ?? path.join(stateDir, "page-maps-state.json");

    const oldState = loadState(stateFilePath);
    const newState: Record<string, string> = {};

    const mapFiles = readAllPageMaps(opts.mapsDir);
    log.info(`Found ${mapFiles.length} page-map(s).`);

    let processed = 0;

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

        // ✅ IMPORTANT: even with --changedOnly, we must re-create missing outputs.
        const missingOutputs = hasMissingGeneratedOutputs({
            pagesDir: opts.pagesDir,
            pageKey: pageMap.pageKey,
        });

        const shouldSkip = opts.changedOnly && !changed && !missingOutputs;
        if (shouldSkip) {
            if (opts.verbose) log.debug(`UNCHANGED → skipping ${file}`);
            continue;
        }

        // Scaffold (create-only + aliases.generated overwrite-safe)
        if (scaffold) {
            // If folder/files are missing, this will recreate them
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

    // always update state
    saveState(stateFilePath, newState);

    log.info(`State file updated: ${stateFilePath}`);
    log.info(`Processed pages: ${processed}`);
}