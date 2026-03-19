// src/utils/artifacts.ts
import fs from "node:fs";
import path from "node:path";
import { ensureDir, ensureParentDir } from "./fs";

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

function buildArchivedPath(filePath: string, withTimestamp: boolean, date = new Date()) {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    const archiveDir = path.join(dir, "archive");

    if (!withTimestamp) {
        return path.join(archiveDir, `${base}${ext}`);
    }

    const timestamp = formatArtifactTimestamp(date);
    return path.join(archiveDir, `${base}_${timestamp}${ext}`);
}

function listArchivedFamily(filePath: string) {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    const archiveDir = path.join(dir, "archive");
    if (!fs.existsSync(archiveDir)) return [];

    const plainName = `${base}${ext}`;
    const stamped = new RegExp(`^${escapeRegex(base)}_\\d{8}_\\d{6}${escapeRegex(ext)}$`);

    return fs.readdirSync(archiveDir)
        .filter((name) => name === plainName || stamped.test(name))
        .sort((a, b) => {
            const aPath = path.join(archiveDir, a);
            const bPath = path.join(archiveDir, b);
            return fs.statSync(bPath).mtimeMs - fs.statSync(aPath).mtimeMs;
        })
        .map((name) => path.join(archiveDir, name));
}

function trimArchivedFamily(filePath: string, maxToKeep: number) {
    const keep = Math.max(0, Math.floor(maxToKeep || 0));
    const files = listArchivedFamily(filePath);
    files.slice(keep).forEach((oldPath) => fs.unlinkSync(oldPath));
}

function moveExistingFileToArchive(filePath: string, withTimestamp: boolean) {
    if (!fs.existsSync(filePath)) return;

    const archivePath = buildArchivedPath(filePath, withTimestamp);
    ensureParentDir(archivePath);

    if (fs.existsSync(archivePath)) {
        fs.unlinkSync(archivePath);
    }

    fs.renameSync(filePath, archivePath);
}

export function ensureArtifactsArchive(dirPath: string) {
    ensureDir(path.join(dirPath, "archive"));
}

export function writeArtifactFile(
    baseFilePath: string,
    contents: string,
    opts?: ArtifactWriteOptions
): string {
    ensureParentDir(baseFilePath);

    const withTimestamp = !!opts?.withTimestamp;
    const maxToKeep = opts?.maxToKeep ?? 30;

    moveExistingFileToArchive(baseFilePath, withTimestamp);
    trimArchivedFamily(baseFilePath, maxToKeep);

    fs.writeFileSync(baseFilePath, contents, "utf8");
    return baseFilePath;
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