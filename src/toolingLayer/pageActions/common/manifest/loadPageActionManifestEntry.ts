// src/toolingLayer/pageActions/common/manifest/loadPageActionManifestEntry.ts

import fs from "node:fs";
import path from "node:path";
import { PAGE_ACTIONS_MANIFEST_DIR } from "@utils/paths";
import type { PageActionManifestEntry } from "../../generator/manifest/types";

export function loadPageActionManifestEntry(
    relativeFilePath: string
): PageActionManifestEntry {
    const filePath = path.join(PAGE_ACTIONS_MANIFEST_DIR, relativeFilePath);

    return JSON.parse(
        fs.readFileSync(filePath, "utf8")
    ) as PageActionManifestEntry;
}
