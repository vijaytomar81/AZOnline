// src/pageObjectTools/page-object-validator/validate/rules/manifest/manifestAgainstPageMap/buildManifestExpectedValues.ts

import { getPageArtifactPaths } from "../../../../../page-object-common/pagePaths";
import type { LoadedPageMap } from "../../../../../page-object-common/readPageMap";

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
        pageObjectImport: `@page-objects/${pageMapItem.pageMap.pageKey
            .split(".")
            .join("/")}/${artifact.className}`,
        elementCount: Object.keys(pageMapItem.pageMap.elements ?? {}).length,
        urlPath: pageMapItem.pageMap.urlPath ?? undefined,
        title: pageMapItem.pageMap.title ?? undefined,
    };
}
