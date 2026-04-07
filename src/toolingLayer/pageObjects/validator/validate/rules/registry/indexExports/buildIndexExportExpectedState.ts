// src/tools/pageObjects/validator/validate/rules/registry/indexExports/buildIndexExportExpectedState.ts

import type { LoadedPageMap } from "@toolingLayer/pageObjects/common/readPageMap";
import type { IndexExportExpectedState } from "./indexExportTypes";
import { expectedClassName, expectedImportPath } from "./indexExportNaming";

export function buildIndexExportExpectedState(
    pageMaps: LoadedPageMap[]
): IndexExportExpectedState {
    const exportPathByPageKey = new Map<string, string>();

    for (const item of pageMaps) {
        const pageKey = item.pageMap.pageKey;
        const className = expectedClassName(pageKey);
        exportPathByPageKey.set(pageKey, expectedImportPath(pageKey, className));
    }

    return {
        exportPathByPageKey,
        expectedPaths: new Set<string>([
            "./pageManager",
            ...exportPathByPageKey.values(),
        ]),
    };
}
