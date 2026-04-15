// src/frameworkCore/logging/utils/ensureLogDir.ts

import fs from "node:fs";

export function ensureLogDir(dirPath: string): void {
    if (!dirPath.trim()) {
        return;
    }

    fs.mkdirSync(dirPath, { recursive: true });
}