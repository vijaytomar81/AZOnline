// src/tools/pageActions/generator/generator/readPageObjectFile.ts

import fs from "node:fs";

export function readPageObjectFile(filePath: string): string {
    return fs.readFileSync(filePath, "utf8");
}
