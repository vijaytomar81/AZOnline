// src/toolingLayer/pageActions/common/expected/buildExpectedManifestEntry.ts

import { toRepoRelative } from "@utils/paths";
import type {
    PageActionManifestEntry,
    PageObjectManifestPage,
} from "../../generator/manifest/types";
import type {
    ActionNaming,
    ActionPathInfo,
} from "../../generator/shared/types";

export function buildExpectedManifestEntry(args: {
    page: PageObjectManifestPage;
    naming: ActionNaming;
    paths: ActionPathInfo;
}): PageActionManifestEntry {
    return {
        pageKey: args.page.pageKey,
        actionKey: args.naming.actionKey,
        actionName: args.naming.actionName,
        scope: args.page.scope,
        paths: {
            actionFile: toRepoRelative(args.paths.actionFile),
            productIndexFile: toRepoRelative(args.paths.productIndexFile),
            applicationIndexFile: toRepoRelative(args.paths.applicationIndexFile),
            platformIndexFile: toRepoRelative(args.paths.platformIndexFile),
            actionsIndexFile: toRepoRelative(args.paths.actionsIndexFile),
            rootIndexFile: toRepoRelative(args.paths.rootIndexFile),
            sourcePageObjectFile: args.page.paths.pageObjectFile,
        },
    };
}
