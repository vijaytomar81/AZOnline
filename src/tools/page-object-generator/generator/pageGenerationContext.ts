// src/tools/page-object-generator/generator/pageGenerationContext.ts

import { hashContent } from "@utils/hash";
import type { PageMap } from "./types";
import { buildPageArtifact, type PageArtifact } from "./pageArtifact";
import { hasMissingGeneratedOutputs } from "./scaffold";

export type PageGenerationContext = {
    file: string;
    raw: string;
    pageMap: PageMap;
    artifact: PageArtifact;
    hash: string;
    oldHash?: string;
    changed: boolean;
    missingOutputs: boolean;
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
}): PageGenerationContext {
    const { file, raw, pageMap, pageObjectsDir, oldHash, changedOnly = false } = params;

    const artifact = buildPageArtifact(pageObjectsDir, pageMap.pageKey);
    const hash = hashContent(raw);
    const changed = oldHash !== hash;
    const missingOutputs = hasMissingGeneratedOutputs({
        pagesDir: pageObjectsDir,
        pageKey: pageMap.pageKey,
    });

    return {
        file,
        raw,
        pageMap,
        artifact,
        hash,
        oldHash,
        changed,
        missingOutputs,
        shouldScaffold: missingOutputs,
        shouldSkip: changedOnly && !changed && !missingOutputs,
    };
}