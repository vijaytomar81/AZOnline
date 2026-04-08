// src/toolingLayer/pageActions/generator/core/manifestSync/buildPageActionManifestEntry.ts

import { toRepoRelative } from "@utils/paths";
import type {
    PageActionManifestEntry,
    PageObjectManifestPage,
} from "../../manifest/types";
import type { ActionNaming, ActionPathInfo } from "../../shared/types";

export function buildPageActionManifestEntry(args: {
    page: PageObjectManifestPage;
    naming: ActionNaming;
    paths: ActionPathInfo;
}): PageActionManifestEntry {
    return {
        pageKey: args.page.pageKey,
        actionKey: args.naming.actionKey,
        group: args.page.group,
        actionName: args.naming.actionName,
        paths: {
            actionFile: toRepoRelative(args.paths.actionFile),
            indexFile: toRepoRelative(args.paths.platformIndexFile),
            sourcePageObjectFile: args.page.paths.pageObjectFile,
        },
        generatedAt: new Date().toISOString(),
    };
}
