// src/tools/pageActions/generator/generator/writePageActionManifestEntry.ts

import fs from "node:fs";
import path from "node:path";
import type { PageActionManifestEntry } from "../manifest/types";

export function writePageActionManifestEntry(args: {
    filePath: string;
    entry: PageActionManifestEntry;
}): void {
    fs.mkdirSync(path.dirname(args.filePath), { recursive: true });
    fs.writeFileSync(
        args.filePath,
        `${JSON.stringify(args.entry, null, 2)}\n`
    );
}
