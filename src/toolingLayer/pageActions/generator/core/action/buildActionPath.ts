// src/tools/pageActions/generator/core/action/buildActionPath.ts

import path from "node:path";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_DIR,
    PAGE_ACTIONS_MANIFEST_ACTIONS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_ACTIONS_MANIFEST_INDEX_FILE,
} from "@utils/paths";
import type { PageObjectManifestPage } from "../../manifest/types";
import type { ActionNaming, ActionPathInfo } from "../../shared/types";

export function buildActionPath(args: {
    page: PageObjectManifestPage;
    naming: ActionNaming;
}): ActionPathInfo {
    const [platform] = args.page.pageKey.split(".");
    const group = args.page.group;

    const actionDir = path.join(PAGE_ACTIONS_ACTIONS_DIR, platform, group);

    return {
        platform,
        group,
        actionDir,
        actionFile: path.join(actionDir, args.naming.actionFileName),
        leafIndexFile: path.join(actionDir, "index.ts"),
        platformIndexFile: path.join(
            PAGE_ACTIONS_ACTIONS_DIR,
            platform,
            "index.ts"
        ),
        rootIndexFile: path.join(PAGE_ACTIONS_DIR, "index.ts"),
        manifestDir: PAGE_ACTIONS_MANIFEST_DIR,
        manifestIndexFile: PAGE_ACTIONS_MANIFEST_INDEX_FILE,
        manifestActionsDir: PAGE_ACTIONS_MANIFEST_ACTIONS_DIR,
        manifestEntryFile: path.join(
            PAGE_ACTIONS_MANIFEST_ACTIONS_DIR,
            `${args.naming.actionKey}.json`
        ),
    };
}
