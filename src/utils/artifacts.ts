// src/utils/artifacts.ts
import fs from "node:fs";
import path from "node:path";
import { ensureDir, ensureParentDir } from "./fs";

export type ArtifactWriteOptions = {
    withTimestamp?: boolean;
    pretty?: boolean;
    archiveDirPath: string;
    maxToKeep?: number;
};

const TIMESTAMP_SUFFIX = /_\d{8}_\d{6}$/;

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

function buildActiveArtifactPath(baseFilePath: string, withTimestamp: boolean, date = new Date()) {
    if (!withTimestamp) return baseFilePath;

    const dir = path.dirname(baseFilePath);
    const ext = path.extname(baseFilePath);
    const base = path.basename(baseFilePath, ext);

    return path.join(dir, `${base}_${formatArtifactTimestamp(date)}${ext}`);
}

function buildArchivedArtifactPath(sourceFilePath: string, archiveDirPath: string, date = new Date()) {
    const ext = path.extname(sourceFilePath);
    const base = path.basename(sourceFilePath, ext);

    if (TIMESTAMP_SUFFIX.test(base)) {
        return path.join(archiveDirPath, `${base}${ext}`);
    }

    return path.join(archiveDirPath, `${base}_${formatArtifactTimestamp(date)}${ext}`);
}

function listActiveFamilyFiles(baseFilePath: string): string[] {
    const dir = path.dirname(baseFilePath);
    const ext = path.extname(baseFilePath);
    const base = path.basename(baseFilePath, ext);
    if (!fs.existsSync(dir)) return [];

    const plainName = `${base}${ext}`;
    const stampedPattern = new RegExp(`^${escapeRegex(base)}_\\d{8}_\\d{6}${escapeRegex(ext)}$`);

    return fs.readdirSync(dir)
        .filter((name) => name === plainName || stampedPattern.test(name))
        .map((name) => path.join(dir, name));
}

function listArchivedFamilyFiles(baseFilePath: string, archiveDirPath: string): string[] {
    const ext = path.extname(baseFilePath);
    const base = path.basename(baseFilePath, ext);
    if (!fs.existsSync(archiveDirPath)) return [];

    const stampedPattern = new RegExp(`^${escapeRegex(base)}_\\d{8}_\\d{6}${escapeRegex(ext)}$`);

    return fs.readdirSync(archiveDirPath)
        .filter((name) => stampedPattern.test(name))
        .sort((a, b) => b.localeCompare(a))
        .map((name) => path.join(archiveDirPath, name));
}

function trimArchivedFamily(baseFilePath: string, archiveDirPath: string, maxToKeep: number) {
    const keep = Math.max(0, Math.floor(maxToKeep || 0));
    const files = listArchivedFamilyFiles(baseFilePath, archiveDirPath);
    files.slice(keep).forEach((oldPath) => fs.unlinkSync(oldPath));
}

function archiveActiveFamily(baseFilePath: string, archiveDirPath: string, maxToKeep: number) {
    const activeFiles = listActiveFamilyFiles(baseFilePath);
    ensureDir(archiveDirPath);

    activeFiles.forEach((activePath) => {
        const archivedPath = buildArchivedArtifactPath(activePath, archiveDirPath);
        ensureParentDir(archivedPath);

        if (fs.existsSync(archivedPath)) {
            fs.unlinkSync(archivedPath);
        }

        fs.renameSync(activePath, archivedPath);
    });

    trimArchivedFamily(baseFilePath, archiveDirPath, maxToKeep);
}

export function writeArtifactFile(
    baseFilePath: string,
    contents: string,
    opts: ArtifactWriteOptions
): string {
    ensureParentDir(baseFilePath);

    const withTimestamp = !!opts.withTimestamp;
    const archiveDirPath = opts.archiveDirPath;
    const maxToKeep = opts.maxToKeep ?? 30;

    archiveActiveFamily(baseFilePath, archiveDirPath, maxToKeep);

    const targetPath = buildActiveArtifactPath(baseFilePath, withTimestamp);
    fs.writeFileSync(targetPath, contents, "utf8");

    return targetPath;
}

export function writeArtifactJson(
    baseFilePath: string,
    data: unknown,
    opts: ArtifactWriteOptions
): string {
    const pretty = opts.pretty ?? true;
    const raw = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    return writeArtifactFile(baseFilePath, raw, opts);
}