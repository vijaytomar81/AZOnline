// src/toolingLayer/pageActions/generator/core/manifestSync/loadPageActionManifestIndex.ts

import fs from "node:fs";
import { PAGE_ACTIONS_MANIFEST_INDEX_FILE } from "@utils/paths";
import type { PageActionManifestIndex } from "../../manifest/types";

export function loadPageActionManifestIndex(): PageActionManifestIndex {
    if (!fs.existsSync(PAGE_ACTIONS_MANIFEST_INDEX_FILE)) {
        return {
            version: 1,
            generatedAt: new Date().toISOString(),
            actions: {},
        };
    }

    return JSON.parse(
        fs.readFileSync(PAGE_ACTIONS_MANIFEST_INDEX_FILE, "utf8")
    ) as PageActionManifestIndex;
}
