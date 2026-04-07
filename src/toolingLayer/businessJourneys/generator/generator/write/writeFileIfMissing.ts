// src/tools/businessJourneys/generator/generator/write/writeFileIfMissing.ts

import { fileExists, safeWriteTextIfMissing } from "@utils/fs";

export function writeFileIfMissing(
    filePath: string,
    contents: string
): boolean {
    if (fileExists(filePath)) {
        return false;
    }

    return safeWriteTextIfMissing(filePath, contents);
}
