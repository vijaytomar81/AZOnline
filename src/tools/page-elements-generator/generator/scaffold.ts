// src/tools/page-elements-generator/generator/scaffold.ts
import path from "node:path";

import type { PageMap } from "./types";
import {
    pageKeyToFolder,
    mapPageKeyToAliasesGeneratedPath,
    mapPageKeyToAliasesHumanPath,
    mapPageKeyToPageTsPath,
} from "./paths";

import { safeWriteText, safeWriteTextIfMissing } from "./state";
import { ensureDir } from "@/utils/fs";
import { buildAliasesGeneratedTs } from "../builders/buildAliasesGeneratedTs";
import { buildAliasesHumanTs } from "../builders/buildAliasesHumanTs";
import { buildPageTsStub } from "../builders/buildPageTsStub";
import { syncAliasesIntoPageObject } from "./pageObject";
import { syncAliasesHumanFile } from "./syncAliasesHuman";

export function hasMissingGeneratedOutputs(params: { pagesDir: string; pageKey: string }): boolean {
    const { pagesDir, pageKey } = params;

    const folder = pageKeyToFolder(pagesDir, pageKey);
    const aliasesHumanPath = mapPageKeyToAliasesHumanPath(pagesDir, pageKey);
    const aliasesGenPath = mapPageKeyToAliasesGeneratedPath(pagesDir, pageKey);
    const pageTsPath = mapPageKeyToPageTsPath(pagesDir, pageKey);

    // NOTE: elements.ts is generated in runner.ts (not scaffold.ts)
    const required = [folder, aliasesHumanPath, aliasesGenPath, pageTsPath];

    for (const p of required) {
        if (!require("node:fs").existsSync(p)) return true;
    }
    return false;
}

export function ensureScaffoldFiles(params: {
    pagesDir: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: { info: (s: string) => void; debug?: (s: string) => void };
}) {
    const { pagesDir, pageMap, verbose, log } = params;

    const pageFolder = pageKeyToFolder(pagesDir, pageMap.pageKey);
    ensureDir(pageFolder);

    const aliasesHumanPath = mapPageKeyToAliasesHumanPath(pagesDir, pageMap.pageKey);
    const aliasesGenPath = mapPageKeyToAliasesGeneratedPath(pagesDir, pageMap.pageKey);
    const pageTsPath = mapPageKeyToPageTsPath(pagesDir, pageMap.pageKey);

    // 1) aliases.ts (create-only)
    const createdAliases = safeWriteTextIfMissing(aliasesHumanPath, buildAliasesHumanTs(pageMap));
    if (createdAliases) {
        log.info(`Scaffolded: ${aliasesHumanPath}`);
    } else {
        syncAliasesHumanFile({
            aliasesHumanPath,
            pageMap,
            verbose,
            log,
        });
    }

    // 2) Page object (create-only)
    const createdPage = safeWriteTextIfMissing(pageTsPath, buildPageTsStub(pageMap));
    if (createdPage) log.info(`Scaffolded: ${pageTsPath}`);

    // 3) aliases.generated.ts (always overwrite-safe)
    safeWriteText(aliasesGenPath, buildAliasesGeneratedTs(pageMap));
    if (verbose) log.debug?.(`Generated: ${aliasesGenPath}`);

    // 4) Always sync methods region from aliases.ts into page object
    syncAliasesIntoPageObject({
        pageTsPath,
        pageMap,
        aliasesTsPath: aliasesHumanPath,
    });

    if (verbose) {
        log.debug?.(`Synced page object aliases region: ${path.relative(process.cwd(), pageTsPath)}`);
    }
}