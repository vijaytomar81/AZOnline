// src/toolingLayer/pageActions/generator/core/manifestSync/writePageActionManifestEntry.ts

import fs from "node:fs";
import path from "node:path";
import type { PageActionManifestEntry } from "../../manifest/types";

function toJsonText(entry: PageActionManifestEntry): string {
    return `${JSON.stringify(entry, null, 2)}\n`;
}

export function writePageActionManifestEntry(args: {
    filePath: string;
    entry: PageActionManifestEntry;
}): boolean {
    fs.mkdirSync(path.dirname(args.filePath), { recursive: true });

    const nextText = toJsonText(args.entry);
    const currentText = fs.existsSync(args.filePath)
        ? fs.readFileSync(args.filePath, "utf8")
        : "";

    if (currentText === nextText) {
        return false;
    }

    fs.writeFileSync(args.filePath, nextText, "utf8");
    return true;
}
