// src/tools/page-elements-generator/generator/runner.ts

import fs from "node:fs";
import path from "node:path";

import type { GenOptions, PageMap } from "./types";
import { buildElementsTs } from "../builders/buildElementsTs";
import { syncPageRegistry } from "./syncPageRegistry";
import type { PageRegistryEntry } from "./syncPageRegistry";
import { toPascal } from "../../../utils/ts";

import {
    mapPageKeyToAliasesHumanPath,
    mapPageKeyToElementsPath,
    mapPageKeyToPageTsPath,
} from "./paths";
import { ensureScaffoldFiles, hasMissingGeneratedOutputs } from "./scaffold";
import { hashContent, loadState, saveState } from "./state";
import { ensureDir } from "../../../utils/fs";

export type RepairPageReport = {
    pageKey: string;
    changed: boolean;
    elementsStatus: "generated" | "unchanged";
    aliasesGeneratedStatus: "generated" | "unchanged";
    pageObjectStatus: "generated" | "synced" | "unchanged";
    registryStatus:
    | "already-registered"
    | "added-to-index"
    | "added-to-page-manager"
    | "added-to-both";
};

export type RepairRunReport = {
    pagesScanned: number;
    pagesChanged: number;
    filesGenerated: number;
    registryUpdates: number;
    stateUpdated: boolean;
    pageReports: RepairPageReport[];
};

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

function needsAliasSync(params: { pageObjectsDir: string; pageKey: string }): boolean {
    const { pageObjectsDir, pageKey } = params;

    const aliasesHumanPath = mapPageKeyToAliasesHumanPath(pageObjectsDir, pageKey);
    const pageTsPath = mapPageKeyToPageTsPath(pageObjectsDir, pageKey);

    if (!fs.existsSync(aliasesHumanPath) || !fs.existsSync(pageTsPath)) return false;

    return mtimeMsSafe(aliasesHumanPath) > mtimeMsSafe(pageTsPath);
}

function buildRegistryEntry(pageKey: string): PageRegistryEntry {
    const lastSeg = pageKey.split(".").slice(-1)[0] || "Page";
    return {
        pageKey,
        className: `${toPascal(lastSeg)}Page`,
    };
}

export async function runElementsGenerator(opts: GenOptions): Promise<RepairRunReport> {
    const log = opts.log;

    const scaffoldLog = log.child("scaffold");
    const registryLog = log.child("registry");
    const stateLog = log.child("state");
    const endRun = log.time("elements-generator");

    const scaffold = opts.scaffold !== false;
    const scaffoldIfMissing = opts.scaffoldIfMissing !== false;

    const stateDir = opts.stateDir ?? path.join(process.cwd(), "src", ".scanner-state");
    ensureDir(stateDir);

    const stateFilePath = opts.stateFile ?? path.join(stateDir, "page-maps-state.json");

    const oldState = loadState(stateFilePath);
    const newState: Record<string, string> = {};

    const mapFiles = readAllPageMaps(opts.mapsDir);
    log.info(`Found ${mapFiles.length} page-map(s).`);

    let processed = 0;
    const registryEntries: PageRegistryEntry[] = [];
    const pageReports: RepairPageReport[] = [];

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

        const missingOutputs = hasMissingGeneratedOutputs({
            pagesDir: opts.pageObjectsDir,
            pageKey: pageMap.pageKey,
        });

        const shouldScaffold = scaffold || (missingOutputs && scaffoldIfMissing);

        const aliasSyncNeeded =
            shouldScaffold &&
            needsAliasSync({
                pageObjectsDir: opts.pageObjectsDir,
                pageKey: pageMap.pageKey,
            });

        const shouldSkip = opts.changedOnly && !changed && !missingOutputs && !aliasSyncNeeded;

        const report: RepairPageReport = {
            pageKey: pageMap.pageKey,
            changed: false,
            elementsStatus: changed || missingOutputs ? "generated" : "unchanged",
            aliasesGeneratedStatus: missingOutputs ? "generated" : "unchanged",
            pageObjectStatus: aliasSyncNeeded ? "synced" : missingOutputs ? "generated" : "unchanged",
            registryStatus: "already-registered",
        };

        if (shouldSkip) {
            if (opts.verbose) log.debug(`UNCHANGED → skipping ${file}`);
            pageReports.push(report);
            continue;
        }

        if (shouldScaffold) {
            ensureScaffoldFiles({
                pagesDir: opts.pageObjectsDir,
                pageMap,
                verbose: opts.verbose,
                log: scaffoldLog,
            });
        }

        if (opts.stateOnly) {
            if (opts.verbose) log.debug(`STATE-ONLY → skipping elements write for ${pageMap.pageKey}`);
            processed++;
            report.changed = true;
            pageReports.push(report);
            continue;
        }

        const elementsPath = mapPageKeyToElementsPath(opts.pageObjectsDir, pageMap.pageKey);
        const ts = buildElementsTs(pageMap);

        if (opts.merge && fs.existsSync(elementsPath)) {
            log.info(`Merging (overwrite-safe): ${elementsPath}`);
        } else {
            log.info(`Writing: ${elementsPath}`);
        }

        fs.mkdirSync(path.dirname(elementsPath), { recursive: true });
        fs.writeFileSync(elementsPath, ts, "utf8");

        processed++;
        report.changed = true;
        pageReports.push(report);
    }

    const endRegistrySync = registryLog.time("sync-page-registry");
    const syncRes = syncPageRegistry(registryEntries, opts.pageRegistryDir);
    endRegistrySync();

    const addedIndexPaths = new Set(
        syncRes.index.added.map((line) => {
            const m = line.match(/\.\/(.+)\/[^/]+"?;?$/);
            return m?.[1] ?? "";
        })
    );

    const addedManagerImports = new Set(
        syncRes.pageManager.addedImports.map((line) => {
            const m = line.match(/\.\/(.+)\/[^/]+"?;?$/);
            return m?.[1] ?? "";
        })
    );

    const addedManagerEntries = new Set(
        syncRes.pageManager.addedEntries
    );

    for (const report of pageReports) {
        const pagePath = report.pageKey.split(".").join("/");
        const member = report.pageKey.split(".").slice(-1)[0] || "page";
        const memberCamel = member
            .replace(/[-_.]/g, " ")
            .split(" ")
            .filter(Boolean)
            .map((part, i) =>
                i === 0
                    ? part.charAt(0).toLowerCase() + part.slice(1)
                    : part.charAt(0).toUpperCase() + part.slice(1)
            )
            .join("");

        const group = report.pageKey.split(".")[0] || "common";
        const entrySnippet = `${memberCamel}: this.get("${group}.${memberCamel}"`;

        const addedToIndex = addedIndexPaths.has(pagePath);
        const addedToManager =
            addedManagerImports.has(pagePath) ||
            Array.from(addedManagerEntries).some((line) => line.includes(entrySnippet));

        if (addedToIndex && addedToManager) {
            report.registryStatus = "added-to-both";
        } else if (addedToIndex) {
            report.registryStatus = "added-to-index";
        } else if (addedToManager) {
            report.registryStatus = "added-to-page-manager";
        } else {
            report.registryStatus = "already-registered";
        }

        if (report.registryStatus !== "already-registered") {
            report.changed = true;
        }
    }

    const endStateSave = stateLog.time("save-state");
    saveState(stateFilePath, newState);
    endStateSave();

    stateLog.info(`State file updated: ${stateFilePath}`);
    log.info(`Processed pages: ${processed}`);

    const pagesChanged = pageReports.filter((r) => r.changed).length;

    const filesGenerated = pageReports.reduce((sum, r) => {
        let count = 0;
        if (r.elementsStatus === "generated") count++;
        if (r.aliasesGeneratedStatus === "generated") count++;
        if (r.pageObjectStatus === "generated") count++;
        return sum + count;
    }, 0);

    const registryUpdates =
        syncRes.index.added.length +
        syncRes.pageManager.addedImports.length +
        syncRes.pageManager.addedEntries.length;

    endRun();

    return {
        pagesScanned: mapFiles.length,
        pagesChanged,
        filesGenerated,
        registryUpdates,
        stateUpdated: true,
        pageReports,
    };
}