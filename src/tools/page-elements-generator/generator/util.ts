// src/scanner/elements-generator/util.ts

export function toPascal(s: string) {
    return s
        .replace(/[-_.]/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0].toUpperCase() + p.slice(1))
        .join("");
}

export function isValidTsIdentifier(key: string) {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}

export function escapeTsString(s: string) {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function ensureDir(dir: string) {
    const fs = require("node:fs") as typeof import("node:fs");
    fs.mkdirSync(dir, { recursive: true });
}

export function safeWriteText(file: string, content: string) {
    const fs = require("node:fs") as typeof import("node:fs");
    const path = require("node:path") as typeof import("node:path");
    ensureDir(path.dirname(file));
    fs.writeFileSync(file, content, "utf8");
}

export function safeWriteTextIfMissing(file: string, content: string): boolean {
    const fs = require("node:fs") as typeof import("node:fs");
    if (fs.existsSync(file)) return false;
    safeWriteText(file, content);
    return true;
}

export function safeReadJson<T>(file: string): T | null {
    const fs = require("node:fs") as typeof import("node:fs");
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}