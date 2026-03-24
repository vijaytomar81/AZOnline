// src/tools/page-object-generator/generator/scaffold.ts

import fs from "node:fs";
import path from "node:path";

import type { Logger } from "@utils/logger";
import { ensureDir, safeWriteText } from "@utils/fs";
import type { PageMap } from "./types";
import { buildPageArtifact } from "./pageArtifact";
import { buildAliasesGeneratedTs } from "../builders/buildAliasesGeneratedTs";
import { buildAliasesHumanTs } from "../builders/buildAliasesHumanTs";
import { buildPageTsStub } from "../builders/buildPageTsStub";
import { syncAliasesIntoPageObject } from "./pageObject";

function writeIfMissing(filePath: string, content: string): boolean {
    if (fs.existsSync(filePath)) return false;
    safeWriteText(filePath, content);
    return true;
}

export function hasMissingGeneratedOutputs(params: { pagesDir: string; pageKey: string }): boolean {
    const artifact = buildPageArtifact(params.pagesDir, params.pageKey);
    const required = [
        artifact.folderPath,
        artifact.elementsPath,
        artifact.aliasesGeneratedPath,
        artifact.aliasesHumanPath,
        artifact.pageObjectPath,
    ];

    return required.some((p) => !fs.existsSync(p));
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

    if (writeIfMissing(artifact.aliasesHumanPath, buildAliasesHumanTs(pageMap))) {
        log.info(`Scaffolded: ${artifact.aliasesHumanPath}`);
    }

    if (writeIfMissing(artifact.aliasesGeneratedPath, buildAliasesGeneratedTs(pageMap))) {
        log.info(`Scaffolded: ${artifact.aliasesGeneratedPath}`);
    }

    if (writeIfMissing(artifact.pageObjectPath, buildPageTsStub(pageMap))) {
        log.info(`Scaffolded: ${artifact.pageObjectPath}`);
    }

    syncAliasesIntoPageObject({
        pageTsPath: artifact.pageObjectPath,
        elementsTsPath: artifact.elementsPath,
        aliasesTsPath: artifact.aliasesHumanPath,
    });

    if (verbose) {
        log.debug(`Synced page object aliases region: ${path.relative(process.cwd(), artifact.pageObjectPath)}`);
    }
}