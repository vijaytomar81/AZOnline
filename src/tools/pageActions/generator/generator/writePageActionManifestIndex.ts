// src/tools/pageActions/generator/generator/writePageActionManifestIndex.ts

import fs from "node:fs";
import path from "node:path";
import type { PageActionManifestIndex } from "../manifest/types";

export function writePageActionManifestIndex(args: {
    filePath: string;
    index: PageActionManifestIndex;
}): void {
    fs.mkdirSync(path.dirname(args.filePath), { recursive: true });
    fs.writeFileSync(
        args.filePath,
        `${JSON.stringify(args.index, null, 2)}\n`
    );
}
