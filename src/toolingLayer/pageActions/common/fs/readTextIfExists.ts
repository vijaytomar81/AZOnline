// src/toolingLayer/pageActions/common/fs/readTextIfExists.ts

import fs from "node:fs";

export function readTextIfExists(filePath: string): string | null {
    if (!fs.existsSync(filePath)) {
        return null;
    }

    return fs.readFileSync(filePath, "utf8");
}
