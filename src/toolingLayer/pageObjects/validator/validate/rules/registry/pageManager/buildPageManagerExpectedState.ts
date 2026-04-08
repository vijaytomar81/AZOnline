// src/toolingLayer/pageObjects/validator/validate/rules/registry/pageManager/buildPageManagerExpectedState.ts

import type { LoadedPageMap } from "@toolingLayer/pageObjects/common/readPageMap";
import type { PageManagerExpectedState } from "./pageManagerTypes";
import {
    expectedClassName,
    expectedImportPath,
    expectedKeyId,
} from "./pageManagerNaming";

export function buildPageManagerExpectedState(
    pageMaps: LoadedPageMap[]
): PageManagerExpectedState {
    const importByPage = new Map<string, string>();
    const keyIdByPage = new Map<string, string>();

    for (const item of pageMaps) {
        const pageKey = item.pageMap.pageKey;
        const className = expectedClassName(pageKey);

        importByPage.set(pageKey, expectedImportPath(pageKey, className));
        keyIdByPage.set(pageKey, expectedKeyId(pageKey));
    }

    return {
        importByPage,
        keyIdByPage,
    };
}