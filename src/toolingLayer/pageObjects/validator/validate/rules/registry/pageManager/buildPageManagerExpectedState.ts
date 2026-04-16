// src/toolingLayer/pageObjects/validator/validate/rules/registry/pageManager/buildPageManagerExpectedState.ts

import { getPageArtifactPaths } from "@toolingLayer/pageObjects/common/pagePaths";
import type { LoadedPageMap } from "@toolingLayer/pageObjects/common/readPageMap";
import { toCamelFromText } from "@utils/text";
import type { PageManagerExpectedState } from "./pageManagerTypes";

function pageMember(pageKey: string): string {
    const pageName = pageKey.split(".").slice(-1)[0] || "page";
    return toCamelFromText(pageName);
}

function pageProduct(pageKey: string): string {
    return pageKey.split(".")[2] || "common";
}

export function buildPageManagerExpectedState(
    pageMaps: LoadedPageMap[],
    pageObjectsDir: string
): PageManagerExpectedState {
    const importByPage = new Map<string, string>();
    const keyIdByPage = new Map<string, string>();

    for (const item of pageMaps) {
        const pageKey = item.pageMap.pageKey;
        const artifact = getPageArtifactPaths(pageObjectsDir, pageKey);
        const member = pageMember(pageKey);
        const product = pageProduct(pageKey);

        importByPage.set(pageKey, artifact.registryImportPath);
        keyIdByPage.set(pageKey, `${product}.${member}`);
    }

    return {
        importByPage,
        keyIdByPage,
    };
}
