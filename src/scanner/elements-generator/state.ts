// src/scanner/elements-generator/state.ts

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type StateFile = Record<string, string>;

// ======================================================
// Dir helpers
// ======================================================

export function ensureDir(dir: string) {
    fs.mkdirSync(dir, { recursive: true });
}

// ======================================================
// Hashing + state
// ======================================================

export function hashContent(content: string): string {
    return crypto.createHash("sha1").update(content).digest("hex");
}

export function loadState(filePath: string): StateFile {
    if (!fs.existsSync(filePath)) return {};
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8")) as StateFile;
    } catch {
        return {};
    }
}

export function saveState(filePath: string, state: StateFile) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf8");
}

// ======================================================
// Safe file writers (USED BY SCAFFOLD)
// ======================================================

/**
 * Always overwrite (used for generated files).
 */
export function safeWriteText(filePath: string, content: string) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, "utf8");
}

/**
 * Write only if file does not exist.
 * Returns true when file was created.
 */
export function safeWriteTextIfMissing(filePath: string, content: string): boolean {
    if (fs.existsSync(filePath)) return false;
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, "utf8");
    return true;
}