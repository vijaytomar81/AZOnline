// src/scanner/elements-generator/scaffold.ts

import fs from "node:fs";
import path from "node:path";

import type { PageMap } from "./types";
import {
    pageKeyToFolder,
    mapPageKeyToAliasesGeneratedPath,
    mapPageKeyToAliasesHumanPath,
    mapPageKeyToElementsPath,
    mapPageKeyToPageTsPath,
} from "./paths";

import { safeWriteText, safeWriteTextIfMissing, ensureDir } from "./util";
import { buildAliasesGeneratedTs } from "./builders/buildAliasesGeneratedTs";
import { buildAliasesHumanTs } from "./builders/buildAliasesHumanTs";
import { buildPageTsStub } from "./builders/buildPageTsStub";

/**
 * Returns true if any file/folder was created because it was missing.
 * This is used to override --changedOnly skipping.
 */
export function ensureScaffoldFiles(params: {
    pagesDir: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: { info: (s: string) => void; debug: (s: string) => void };
}): boolean {
    const { pagesDir, pageMap, verbose, log } = params;

    const pageFolder = pageKeyToFolder(pagesDir, pageMap.pageKey);
    const elementsPath = mapPageKeyToElementsPath(pagesDir, pageMap.pageKey);
    const aliasesGenPath = mapPageKeyToAliasesGeneratedPath(pagesDir, pageMap.pageKey);
    const aliasesHumanPath = mapPageKeyToAliasesHumanPath(pagesDir, pageMap.pageKey);
    const pageTsPath = mapPageKeyToPageTsPath(pagesDir, pageMap.pageKey);

    let createdSomething = false;

    // folder
    if (!fs.existsSync(pageFolder)) {
        ensureDir(pageFolder);
        createdSomething = true;
        log.info(`Scaffolded folder: ${pageFolder}`);
    }

    // create-only
    if (safeWriteTextIfMissing(aliasesHumanPath, buildAliasesHumanTs(pageMap))) {
        createdSomething = true;
        log.info(`Scaffolded: ${aliasesHumanPath}`);
    }

    if (safeWriteTextIfMissing(pageTsPath, buildPageTsStub(pageMap))) {
        createdSomething = true;
        log.info(`Scaffolded: ${pageTsPath}`);
    }

    // overwrite-safe (always regenerate)
    safeWriteText(aliasesGenPath, buildAliasesGeneratedTs(pageMap));
    if (verbose) log.debug(`Generated: ${aliasesGenPath}`);

    // NOTE: elements.ts is generated in runner.ts, not here,
    // but we still consider it in "missing outputs" checks elsewhere.
    void elementsPath;

    return createdSomething;
}

/**
 * Used by runner to decide if we should process even when hash didn't change.
 */
export function hasMissingGeneratedOutputs(params: {
    pagesDir: string;
    pageKey: string;
}): boolean {
    const { pagesDir, pageKey } = params;

    const pageFolder = pageKeyToFolder(pagesDir, pageKey);

    const elementsPath = mapPageKeyToElementsPath(pagesDir, pageKey);
    const aliasesGenPath = mapPageKeyToAliasesGeneratedPath(pagesDir, pageKey);
    const aliasesHumanPath = mapPageKeyToAliasesHumanPath(pagesDir, pageKey);
    const pageTsPath = mapPageKeyToPageTsPath(pagesDir, pageKey);

    if (!fs.existsSync(pageFolder)) return true;
    if (!fs.existsSync(elementsPath)) return true;
    if (!fs.existsSync(aliasesGenPath)) return true;
    if (!fs.existsSync(aliasesHumanPath)) return true;
    if (!fs.existsSync(pageTsPath)) return true;

    return false;
}