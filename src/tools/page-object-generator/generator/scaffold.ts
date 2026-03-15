// src/tools/page-object-generator/generator/scaffold.ts
import path from "node:path";

import type { Logger } from "@/utils/logger";
import type { PageMap } from "./types";
import { safeWriteText, safeWriteTextIfMissing } from "./state";
import { ensureDir } from "@/utils/fs";
import { buildAliasesGeneratedTs } from "../builders/buildAliasesGeneratedTs";
import { buildAliasesHumanTs } from "../builders/buildAliasesHumanTs";
import { buildPageTsStub } from "../builders/buildPageTsStub";
import { syncAliasesIntoPageObject } from "./pageObject";
import { syncAliasesHumanFile } from "./syncAliasesHuman";
import { buildPageArtifact } from "./pageArtifact";

export function hasMissingGeneratedOutputs(params: { pagesDir: string; pageKey: string }): boolean {
    const { pagesDir, pageKey } = params;

    const artifact = buildPageArtifact(pagesDir, pageKey);

    const required = [
        artifact.folderPath,
        artifact.aliasesHumanPath,
        artifact.aliasesGeneratedPath,
        artifact.pageObjectPath,
    ];

    for (const p of required) {
        if (!require("node:fs").existsSync(p)) return true;
    }

    return false;
}

export function ensureScaffoldFiles(params: {
    pagesDir: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: Logger;
}) {
    const { pagesDir, pageMap, verbose, log } = params;

    const artifact = buildPageArtifact(pagesDir, pageMap.pageKey);

    ensureDir(artifact.folderPath);

    const createdAliases = safeWriteTextIfMissing(
        artifact.aliasesHumanPath,
        buildAliasesHumanTs(pageMap)
    );

    if (createdAliases) {
        log.info(`Scaffolded: ${artifact.aliasesHumanPath}`);
    } else {
        syncAliasesHumanFile({
            aliasesHumanPath: artifact.aliasesHumanPath,
            pageMap,
            verbose,
            log,
        });
    }

    const createdPage = safeWriteTextIfMissing(
        artifact.pageObjectPath,
        buildPageTsStub(pageMap)
    );

    if (createdPage) {
        log.info(`Scaffolded: ${artifact.pageObjectPath}`);
    }

    safeWriteText(
        artifact.aliasesGeneratedPath,
        buildAliasesGeneratedTs(pageMap)
    );

    if (verbose) {
        log.debug(`Generated: ${artifact.aliasesGeneratedPath}`);
    }

    syncAliasesIntoPageObject({
        pageTsPath: artifact.pageObjectPath,
        pageMap,
        aliasesTsPath: artifact.aliasesHumanPath,
    });

    if (verbose) {
        log.debug(
            `Synced page object aliases region: ${path.relative(process.cwd(), artifact.pageObjectPath)}`
        );
    }
}