// src/scanner/elements-generator/state.ts

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type StateFile = Record<string, string>; // mapFile -> sha1

export function ensureDir(dir: string) {
    fs.mkdirSync(dir, { recursive: true });
}

export function safeReadJson<T>(file: string): T | null {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export function safeWriteText(file: string, content: string) {
    ensureDir(path.dirname(file));
    fs.writeFileSync(file, content, "utf8");
}

export function hashContent(content: string): string {
    return crypto.createHash("sha1").update(content).digest("hex");
}

export function loadState(stateFilePath: string): StateFile {
    return safeReadJson<StateFile>(stateFilePath) ?? {};
}

export function saveState(stateFilePath: string, state: StateFile) {
    safeWriteText(stateFilePath, JSON.stringify(state, null, 2));
}