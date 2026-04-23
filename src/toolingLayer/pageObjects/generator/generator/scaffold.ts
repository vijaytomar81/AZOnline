// src/toolingLayer/pageObjects/generator/generator/scaffold.ts

import fs from "node:fs";
import path from "node:path";

import type { Logger } from "@utils/logger";
import { ensureDir, safeWriteText } from "@utils/fs";
import type { PageMap } from "./types";
import { buildPageArtifact } from "@toolingLayer/pageObjects/common/artifacts/buildPageArtifact";
import { buildAliasesGeneratedTs } from "../builders/buildAliasesGeneratedTs";
import { buildAliasesHumanTs } from "../builders/buildAliasesHumanTs";
import { buildPageTsStub } from "../builders/buildPageTsStub";
import { syncAliasesIntoPageObject } from "./pageObject";

export type ScaffoldResult = {
    aliasesHumanCreated: boolean;
    aliasesGeneratedCreated: boolean;
    pageObjectCreated: boolean;
};

function writeIfMissing(filePath: string, content: string): boolean {
    if (fs.existsSync(filePath)) {
        return false;
    }

    safeWriteText(filePath, content);
    return true;
}

export function hasMissingGeneratedOutputs(params: {
    pagesDir: string;
    pageKey: string;
}): boolean {
    const artifact = buildPageArtifact(params.pagesDir, params.pageKey);
    const required = [
        artifact.folderPath,
        artifact.elementsPath,
        artifact.aliasesGeneratedPath,
        artifact.aliasesHumanPath,
        artifact.pageObjectPath,
    ];

    return required.some((targetPath) => !fs.existsSync(targetPath));
}

export function ensureScaffoldFiles(params: {
    pagesDir: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: Logger;
}): ScaffoldResult {
    const { pagesDir, pageMap, verbose, log } = params;
    const artifact = buildPageArtifact(pagesDir, pageMap.pageKey);

    ensureDir(artifact.folderPath);

    const aliasesHumanCreated = writeIfMissing(
        artifact.aliasesHumanPath,
        buildAliasesHumanTs(pageMap)
    );

    if (aliasesHumanCreated) {
        log.info(`Scaffolded: ${artifact.aliasesHumanPath}`);
    }

    const aliasesGeneratedCreated = writeIfMissing(
        artifact.aliasesGeneratedPath,
        buildAliasesGeneratedTs(pageMap)
    );

    if (aliasesGeneratedCreated) {
        log.info(`Scaffolded: ${artifact.aliasesGeneratedPath}`);
    }

    const pageObjectCreated = writeIfMissing(
        artifact.pageObjectPath,
        buildPageTsStub(pageMap)
    );

    if (pageObjectCreated) {
        log.info(`Scaffolded: ${artifact.pageObjectPath}`);
    }

    syncAliasesIntoPageObject({
        pageTsPath: artifact.pageObjectPath,
        elementsTsPath: artifact.elementsPath,
        aliasesTsPath: artifact.aliasesHumanPath,
    });

    if (verbose) {
        log.debug(
            `Synced page object aliases region: ${path.relative(
                process.cwd(),
                artifact.pageObjectPath
            )}`
        );
    }

    return {
        aliasesHumanCreated,
        aliasesGeneratedCreated,
        pageObjectCreated,
    };
}
