// src/tools/page-elements-validator/validators/shared/pagePaths.ts

import path from "node:path";
import { toPascal } from "../../../../utils/ts";

export function pageKeyToFolder(pagesDir: string, pageKey: string) {
    return path.join(pagesDir, ...pageKey.split("."));
}

export function pageKeyToPageClassFile(pageKey: string) {
    const lastSeg = pageKey.split(".").slice(-1)[0] || "page";
    return `${toPascal(lastSeg)}Page.ts`;
}