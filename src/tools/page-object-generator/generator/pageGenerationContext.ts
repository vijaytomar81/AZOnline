// src/tools/page-object-generator/generator/pageGenerationContext.ts
import { buildPageArtifact, type PageArtifact } from "./pageArtifact";
import { hasMissingGeneratedOutputs } from "./scaffold";
import { hashContent } from "./state";
import { needsAliasSync } from "./changeDetection";
import type { PageMap } from "./types";

export type PageGenerationContext = {
    file: string;
    raw: string;
    pageMap: PageMap;
    artifact: PageArtifact;

    hash: string;
    oldHash?: string;
    changed: boolean;

    missingOutputs: boolean;
    aliasSyncNeeded: boolean;
    shouldScaffold: boolean;
    shouldSkip: boolean;
};

export function buildPageGenerationContext(params: {
    file: string;
    raw: string;
    pageMap: PageMap;
    pageObjectsDir: string;
    oldHash?: string;
    changedOnly?: boolean;
    scaffold?: boolean;
    scaffoldIfMissing?: boolean;
}): PageGenerationContext {
    const {
        file,
        raw,
        pageMap,
        pageObjectsDir,
        oldHash,
        changedOnly = false,
        scaffold = true,
        scaffoldIfMissing = true,
    } = params;

    const artifact = buildPageArtifact(pageObjectsDir, pageMap.pageKey);
    const hash = hashContent(raw);
    const changed = oldHash !== hash;

    const missingOutputs = hasMissingGeneratedOutputs({
        pagesDir: pageObjectsDir,
        pageKey: pageMap.pageKey,
    });

    const shouldScaffold = scaffold || (missingOutputs && scaffoldIfMissing);

    const aliasSyncNeeded =
        shouldScaffold &&
        needsAliasSync({
            pageObjectsDir,
            pageKey: pageMap.pageKey,
        });

    const shouldSkip =
        changedOnly &&
        !changed &&
        !missingOutputs &&
        !aliasSyncNeeded;

    return {
        file,
        raw,
        pageMap,
        artifact,
        hash,
        oldHash,
        changed,
        missingOutputs,
        aliasSyncNeeded,
        shouldScaffold,
        shouldSkip,
    };
}