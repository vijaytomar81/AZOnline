// src/toolingLayer/pageActions/common/expected/buildExpectedActionState.ts

import path from "node:path";
import {
    PAGE_ACTIONS_MANIFEST_DIR,
    toRepoRelative,
} from "@utils/paths";

import type { PageObjectManifestPage } from "../../generator/manifest/types";
import { buildActionName } from "../../generator/core/action/buildActionName";
import { buildActionPath } from "../../generator/core/action/buildActionPath";
import { buildExpectedManifestEntry } from "./buildExpectedManifestEntry";

export type ExpectedActionState = {
    actionName: string;
    actionFileName: string;
    actionKey: string;
    actionFilePath: string;
    actionFileRepoRelative: string;
    manifestEntryRelativePath: string;
    manifestEntry: ReturnType<typeof buildExpectedManifestEntry>;
};

export function buildExpectedActionState(
    page: PageObjectManifestPage
): ExpectedActionState {
    const naming = buildActionName(page);
    const paths = buildActionPath({
        page,
        naming,
    });

    return {
        actionName: naming.actionName,
        actionFileName: naming.actionFileName,
        actionKey: naming.actionKey,
        actionFilePath: paths.actionFile,
        actionFileRepoRelative: toRepoRelative(paths.actionFile),
        manifestEntryRelativePath: path.relative(
            PAGE_ACTIONS_MANIFEST_DIR,
            paths.manifestEntryFile
        ),
        manifestEntry: buildExpectedManifestEntry({
            page,
            naming,
            paths,
        }),
    };
}
