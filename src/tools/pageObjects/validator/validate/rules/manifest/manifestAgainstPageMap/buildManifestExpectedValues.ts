// src/tools/pageObjects/validator/validate/rules/manifest/manifestAgainstPageMap/buildManifestExpectedValues.ts

import { getPageArtifactPaths } from "@pageObjectCommon/pagePaths";
import type { LoadedPageMap } from "@pageObjectCommon/readPageMap";

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
        pageObjectImport: `@pageObjectsObjects/${pageMapItem.pageMap.pageKey
            .split(".")
            .join("/")}/${artifact.className}`,
        elementCount: Object.keys(pageMapItem.pageMap.elements ?? {}).length,
        urlPath: pageMapItem.pageMap.urlPath ?? undefined,
        title: pageMapItem.pageMap.title ?? undefined,
    };
}
