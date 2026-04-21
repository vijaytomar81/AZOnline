// src/toolingLayer/pageActions/generator/core/manifestSync/writePageActionManifestIndex.ts

import fs from "node:fs";
import path from "node:path";
import type { PageActionManifestIndex } from "../../manifest/types";

function toJsonText(index: PageActionManifestIndex): string {
    return `${JSON.stringify(index, null, 2)}\n`;
}

export function writePageActionManifestIndex(args: {
    filePath: string;
    index: PageActionManifestIndex;
}): boolean {
    fs.mkdirSync(path.dirname(args.filePath), { recursive: true });

    const nextText = toJsonText(args.index);
    const currentText = fs.existsSync(args.filePath)
        ? fs.readFileSync(args.filePath, "utf8")
        : "";

    if (currentText === nextText) {
        return false;
    }

    fs.writeFileSync(args.filePath, nextText, "utf8");
    return true;
}
