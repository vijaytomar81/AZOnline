// src/toolingLayer/pageObjects/generator/generator/pageGenerationContext.ts

import { hashContent } from "@utils/hash";
import type { PageMap } from "./types";
import { buildPageArtifact, type PageArtifact } from "./pageArtifact";
import { hasMissingGeneratedOutputs } from "./scaffold";
import {
    parsePageScope,
} from "@toolingLayer/pageObjects/common/manifest/parsePageScope";
import type {
    PageScope,
} from "@toolingLayer/pageObjects/common/manifest/types";

export type InvalidPageInfo = {
    pageKey: string;
    reason: string;
};

export type PageGenerationContext = {
    file: string;
    raw: string;
    pageMap: PageMap;
    scope?: PageScope;
    artifact?: PageArtifact;
    hash: string;
    oldHash?: string;
    changed: boolean;
    missingOutputs: boolean;
    shouldScaffold: boolean;
    shouldSkip: boolean;
    invalidPage?: InvalidPageInfo;
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

    const hash = hashContent(raw);
    const changed = oldHash !== hash;
    const scopeResult = parsePageScope(pageMap.pageKey);

    if (!scopeResult.ok) {
        return {
            file,
            raw,
            pageMap,
            hash,
            oldHash,
            changed,
            missingOutputs: false,
            shouldScaffold: false,
            shouldSkip: true,
            invalidPage: {
                pageKey: pageMap.pageKey,
                reason: scopeResult.reason,
            },
        };
    }

    const artifact = buildPageArtifact(pageObjectsDir, pageMap.pageKey);
    const missingOutputs = hasMissingGeneratedOutputs({
        pagesDir: pageObjectsDir,
        pageKey: pageMap.pageKey,
    });

    return {
        file,
        raw,
        pageMap,
        scope: scopeResult.value,
        artifact,
        hash,
        oldHash,
        changed,
        missingOutputs,
        shouldScaffold: missingOutputs,
        shouldSkip: changedOnly && !changed && !missingOutputs,
    };
}
