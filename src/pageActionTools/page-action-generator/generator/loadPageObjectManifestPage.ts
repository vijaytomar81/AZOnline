// src/pageActionTools/page-action-generator/generator/loadPageObjectManifestPage.ts

import fs from "node:fs";
import path from "node:path";
import { PAGE_MANIFEST_PAGES_DIR } from "@utils/paths";
import type { PageObjectManifestPage } from "../manifest/types";

export function loadPageObjectManifestPage(fileName: string): PageObjectManifestPage {
    const filePath = path.join(PAGE_MANIFEST_PAGES_DIR, fileName);

    return JSON.parse(
        fs.readFileSync(filePath, "utf8")
    ) as PageObjectManifestPage;
}
