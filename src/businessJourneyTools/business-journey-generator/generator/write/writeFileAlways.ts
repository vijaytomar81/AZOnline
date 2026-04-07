// src/businessJourneyTools/business-journey-generator/generator/write/writeFileAlways.ts

import { safeReadText, safeWriteText } from "@utils/fs";

export function writeFileAlways(
    filePath: string,
    contents: string
): boolean {
    const current = safeReadText(filePath);

    if (current === contents) {
        return false;
    }

    safeWriteText(filePath, contents);
    return true;
}
