// src/toolingLayer/pageActions/generator/core/manifestSync/loadPageObjectManifestPage.ts

import fs from "node:fs";
import path from "node:path";
import { PAGE_MANIFEST_DIR } from "@utils/paths";
import type { PageObjectManifestPage } from "../../manifest/types";

export function loadPageObjectManifestPage(
    relativeFilePath: string
): PageObjectManifestPage {
    const filePath = path.join(PAGE_MANIFEST_DIR, relativeFilePath);

    return JSON.parse(
        fs.readFileSync(filePath, "utf8")
    ) as PageObjectManifestPage;
}
