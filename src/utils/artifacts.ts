// src/utils/artifacts.ts
import fs from "node:fs";
import path from "node:path";
import { ensureParentDir } from "./fs";

export type ArtifactWriteOptions = {
    withTimestamp?: boolean;
    maxToKeep?: number;
    pretty?: boolean;
};

function formatArtifactTimestamp(date = new Date()): string {
    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${yyyy}${mm}${dd}_${hh}${min}${ss}`;
}

function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTimestampedPath(baseFilePath: string, date = new Date()): string {
    const dir = path.dirname(baseFilePath);
    const ext = path.extname(baseFilePath);
    const base = path.basename(baseFilePath, ext);
    return path.join(dir, `${base}_${formatArtifactTimestamp(date)}${ext}`);
}

function listArtifactFamily(baseFilePath: string): string[] {
    const dir = path.dirname(baseFilePath);
    const ext = path.extname(baseFilePath);
    const base = path.basename(baseFilePath, ext);
    if (!fs.existsSync(dir)) return [];

    const pattern = new RegExp(`^${escapeRegex(base)}_\\d{8}_\\d{6}${escapeRegex(ext)}$`);

    return fs.readdirSync(dir)
        .filter((name) => pattern.test(name))
        .sort((a, b) => b.localeCompare(a))
        .map((name) => path.join(dir, name));
}

function trimArtifactFamily(baseFilePath: string, maxToKeep: number) {
    const keep = Math.max(1, Math.floor(maxToKeep || 1));
    const files = listArtifactFamily(baseFilePath);
    files.slice(keep).forEach((filePath) => fs.unlinkSync(filePath));
}

export function writeArtifactFile(
    baseFilePath: string,
    contents: string,
    opts?: ArtifactWriteOptions
): string {
    ensureParentDir(baseFilePath);

    const withTimestamp = !!opts?.withTimestamp;
    const maxToKeep = opts?.maxToKeep ?? 30;

    if (!withTimestamp) {
        fs.writeFileSync(baseFilePath, contents, "utf8");
        return baseFilePath;
    }

    const targetPath = buildTimestampedPath(baseFilePath);
    fs.writeFileSync(targetPath, contents, "utf8");
    trimArtifactFamily(baseFilePath, maxToKeep);

    return targetPath;
}

export function writeArtifactJson(
    baseFilePath: string,
    data: unknown,
    opts?: ArtifactWriteOptions
): string {
    const pretty = opts?.pretty ?? true;
    const raw = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    return writeArtifactFile(baseFilePath, raw, opts);
}