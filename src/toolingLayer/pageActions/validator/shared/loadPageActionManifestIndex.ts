// src/toolingLayer/pageActions/validator/shared/loadPageActionManifestIndex.ts

import fs from "node:fs";
import { PAGE_ACTIONS_MANIFEST_INDEX_FILE } from "@utils/paths";
import type { PageActionManifestIndex } from "../../generator/manifest/types";

export function loadPageActionManifestIndex(): PageActionManifestIndex {
    return JSON.parse(
        fs.readFileSync(PAGE_ACTIONS_MANIFEST_INDEX_FILE, "utf8")
    ) as PageActionManifestIndex;
}
