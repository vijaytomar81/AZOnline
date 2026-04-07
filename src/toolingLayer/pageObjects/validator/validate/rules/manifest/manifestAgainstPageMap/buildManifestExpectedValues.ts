// src/tools/pageObjects/validator/validate/rules/manifest/manifestAgainstPageMap/buildManifestExpectedValues.ts

import { getPageArtifactPaths } from "@toolingLayer/pageObjects/common/pagePaths";
import type { LoadedPageMap } from "@toolingLayer/pageObjects/common/readPageMap";

export type ManifestExpectedValues = {
    className: string;
    pageObjectImport: string;
    elementCount: number;
    urlPath: string | undefined;
    title: string | undefined;
};

export function buildManifestExpectedValues(
    pageObjectsDir: string,
    pageMapItem: LoadedPageMap
): ManifestExpectedValues {
    const artifact = getPageArtifactPaths(pageObjectsDir, pageMapItem.pageMap.pageKey);

    return {
        className: artifact.className,
        pageObjectImport: `@businessLayer/pageObjects/objects/${pageMapItem.pageMap.pageKey
            .split(".")
            .join("/")}/${artifact.className}`,
        elementCount: Object.keys(pageMapItem.pageMap.elements ?? {}).length,
        urlPath: pageMapItem.pageMap.urlPath ?? undefined,
        title: pageMapItem.pageMap.title ?? undefined,
    };
}
