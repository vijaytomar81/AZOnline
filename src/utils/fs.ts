// src/utils/fs.ts
import fs from "node:fs";
import path from "node:path";

export function ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

export function ensureParentDir(filePath: string) {
    ensureDir(path.dirname(filePath));
}

export function fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
}

export function safeReadText(filePath: string): string | null {
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, "utf8");
}

export function safeReadJson<T>(filePath: string): T | null {
    const raw = safeReadText(filePath);
    if (!raw) return null;
    return JSON.parse(raw) as T;
}

export function safeWriteText(filePath: string, contents: string) {
    ensureParentDir(filePath);
    fs.writeFileSync(filePath, contents, "utf8");
}

export function safeWriteTextIfMissing(filePath: string, contents: string): boolean {
    if (fs.existsSync(filePath)) return false;
    safeWriteText(filePath, contents);
    return true;
}

export function safeWriteJson(filePath: string, data: unknown, pretty = true) {
    const raw = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    safeWriteText(filePath, raw);
}

export function listFiles(dirPath: string, opts?: { ext?: string; includeDotFiles?: boolean }): string[] {
    if (!fs.existsSync(dirPath)) return [];
    const includeDotFiles = !!opts?.includeDotFiles;
    const ext = opts?.ext;

    return fs
        .readdirSync(dirPath)
        .filter((f) => (includeDotFiles ? true : !f.startsWith(".")))
        .filter((f) => (ext ? f.endsWith(ext) : true))
        .sort((a, b) => a.localeCompare(b));
}