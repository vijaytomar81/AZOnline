// src/dataLayer/runtime/manifest/resolveManifestFilePath.ts

import fs from "node:fs";
import { ROOT } from "@utils/paths";

export function resolveManifestFilePath(
    item?: { filePath?: string }
): string | null {
    if (!item?.filePath) {
        return null;
    }

    if (fs.existsSync(item.filePath)) {
        return item.filePath;
    }

    return `${ROOT}/${item.filePath}`.replace(/\/+/g, "/");
}