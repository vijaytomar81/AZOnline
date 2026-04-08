// src/toolingLayer/pageActions/generator/core/manifestSync/loadPageObjectManifestIndex.ts

import fs from "node:fs";
import { PAGE_MANIFEST_INDEX_FILE } from "@utils/paths";
import type { PageObjectManifestIndex } from "../../manifest/types";

export function loadPageObjectManifestIndex(): PageObjectManifestIndex {
    return JSON.parse(
        fs.readFileSync(PAGE_MANIFEST_INDEX_FILE, "utf8")
    ) as PageObjectManifestIndex;
}
