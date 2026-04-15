// src/toolingLayer/pageActions/generator/core/action/readPageObjectFile.ts

import fs from "node:fs";

export function readPageObjectFile(filePath: string): string {
    return fs.readFileSync(filePath, "utf8");
}
