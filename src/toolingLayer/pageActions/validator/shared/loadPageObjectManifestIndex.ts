// src/toolingLayer/pageActions/validator/shared/loadPageObjectManifestIndex.ts

import fs from "node:fs";
import { PAGE_MANIFEST_INDEX_FILE } from "@utils/paths";
import type { PageObjectManifestIndex } from "../../generator/manifest/types";

export function loadPageObjectManifestIndex(): PageObjectManifestIndex {
    return JSON.parse(
        fs.readFileSync(PAGE_MANIFEST_INDEX_FILE, "utf8")
    ) as PageObjectManifestIndex;
}
