// src/toolingLayer/pageActions/validator/shared/expectedActionState.ts

import { toRepoRelative } from "@utils/paths";
import type {
    PageActionManifestEntry,
    PageObjectManifestPage,
} from "../../generator/manifest/types";
import { buildActionName } from "../../generator/core/action/buildActionName";
import { buildActionPath } from "../../generator/core/action/buildActionPath";

export type ExpectedActionState = {
    actionName: string;
    actionFileName: string;
    actionKey: string;
    actionFilePath: string;
    actionFileRepoRelative: string;
    manifestEntryRelativePath: string;
    manifestEntry: PageActionManifestEntry;
};

export function buildExpectedActionState(
    page: PageObjectManifestPage
): ExpectedActionState {
    const naming = buildActionName(page);
    const paths = buildActionPath({ page, naming });

    return {
        actionName: naming.actionName,
        actionFileName: naming.actionFileName,
        actionKey: naming.actionKey,
        actionFilePath: paths.actionFile,
        actionFileRepoRelative: toRepoRelative(paths.actionFile),
        manifestEntryRelativePath: toRepoRelative(paths.manifestEntryFile)
            .replace(/^src\/businessLayer\/pageActions\/\.manifest\//, ""),
        manifestEntry: {
            pageKey: page.pageKey,
            actionKey: naming.actionKey,
            actionName: naming.actionName,
            scope: page.scope,
            paths: {
                actionFile: toRepoRelative(paths.actionFile),
                productIndexFile: toRepoRelative(paths.productIndexFile),
                applicationIndexFile: toRepoRelative(paths.applicationIndexFile),
                platformIndexFile: toRepoRelative(paths.platformIndexFile),
                actionsIndexFile: toRepoRelative(paths.actionsIndexFile),
                rootIndexFile: toRepoRelative(paths.rootIndexFile),
                sourcePageObjectFile: page.paths.pageObjectFile,
            },
        },
    };
}
