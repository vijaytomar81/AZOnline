// src/pageActionTools/page-action-repair/repair/shared/manifest.ts

import fs from "node:fs";

export function readJson<T>(filePath: string, fallback: T): T {
    return fs.existsSync(filePath)
        ? (JSON.parse(fs.readFileSync(filePath, "utf8")) as T)
        : fallback;
}

export function writeJson(filePath: string, value: unknown): void {
    fs.mkdirSync(require("node:path").dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
