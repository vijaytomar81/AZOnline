// src/toolingLayer/pageActions/generator/core/action/buildActionPath.ts

import path from "node:path";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_ACTIONS_MANIFEST_INDEX_FILE,
} from "@utils/paths";
import type { PageObjectManifestPage } from "../../manifest/types";
import type { ActionNaming, ActionPathInfo } from "../../shared/types";

export function buildActionPath(args: {
    page: PageObjectManifestPage;
    naming: ActionNaming;
}): ActionPathInfo {
    const { platform, application, product } = args.page.scope;
    const actionDir = path.join(
        PAGE_ACTIONS_ACTIONS_DIR,
        platform,
        application,
        product
    );

    return {
        platform,
        application,
        product,
        actionDir,
        actionFile: path.join(actionDir, args.naming.actionFileName),
        productIndexFile: path.join(actionDir, "index.ts"),
        applicationIndexFile: path.join(
            PAGE_ACTIONS_ACTIONS_DIR,
            platform,
            application,
            "index.ts"
        ),
        platformIndexFile: path.join(
            PAGE_ACTIONS_ACTIONS_DIR,
            platform,
            "index.ts"
        ),
        actionsIndexFile: path.join(PAGE_ACTIONS_ACTIONS_DIR, "index.ts"),
        rootIndexFile: path.join(PAGE_ACTIONS_DIR, "index.ts"),
        manifestDir: PAGE_ACTIONS_MANIFEST_DIR,
        manifestIndexFile: PAGE_ACTIONS_MANIFEST_INDEX_FILE,
        manifestEntryFile: path.join(
            PAGE_ACTIONS_MANIFEST_DIR,
            platform,
            application,
            product,
            `${args.naming.actionSlug}.action.json`
        ),
    };
}
