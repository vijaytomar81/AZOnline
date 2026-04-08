// src/evidenceLayer/artifacts/run/promoteWorkerPageScans.ts

import fs from "node:fs/promises";
import path from "node:path";

export type PromoteWorkerPageScansInput = {
    runId: string;
    outputRoot: string;
};

export type PromoteWorkerPageScansResult = {
    promotedFileCount: number;
    pageScansDir: string;
};

function buildRunPaths(runId: string, outputRoot: string) {
    const baseDir = path.join(outputRoot, runId);

    return {
        baseDir,
        pageScansDir: path.join(baseDir, "page-scans"),
    };
}

function sanitizeFilePart(value: string): string {
    return value.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "unknown";
}

function buildTimestampFromStat(mtimeMs: number): string {
    const date = new Date(mtimeMs);
    const pad = (n: number, size = 2) => String(n).padStart(size, "0");

    return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate()),
        "_",
        pad(date.getHours()),
        pad(date.getMinutes()),
        pad(date.getSeconds()),
    ].join("");
}

async function listWorkerDirs(baseDir: string): Promise<string[]> {
    try {
        const entries = await fs.readdir(baseDir, { withFileTypes: true });

        return entries
            .filter(
                (entry) => entry.isDirectory() && /^worker-\d+$/.test(entry.name)
            )
            .map((entry) => path.join(baseDir, entry.name))
            .sort((a, b) => a.localeCompare(b));
    } catch {
        return [];
    }
}

async function collectPageScanFiles(dirPath: string): Promise<string[]> {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        const nested = await Promise.all(
            entries.map(async (entry) => {
                const fullPath = path.join(dirPath, entry.name);

                if (entry.isDirectory()) {
                    return collectPageScanFiles(fullPath);
                }

                const isPageScanJson =
                    entry.isFile() &&
                    entry.name.endsWith(".json") &&
                    fullPath.split(path.sep).includes("page-scans");

                return isPageScanJson ? [fullPath] : [];
            })
        );

        return nested.flat().sort((a, b) => a.localeCompare(b));
    } catch {
        return [];
    }
}

function inferTestCaseId(workerFilePath: string, workerDir: string): string {
    const relativePath = path.relative(workerDir, workerFilePath);
    const segments = relativePath.split(path.sep);
    const workerIndex = segments.findIndex((segment) => segment === "page-scans");

    if (workerIndex > 0) {
        return sanitizeFilePart(segments[workerIndex - 1] || "unknown");
    }

    return "unknown";
}

function inferPageKey(filePath: string): string {
    return sanitizeFilePart(path.basename(filePath, ".json"));
}

async function buildTargetPath(args: {
    sourcePath: string;
    workerDir: string;
    pageScansDir: string;
}): Promise<string> {
    const stat = await fs.stat(args.sourcePath);
    const testCaseId = inferTestCaseId(args.sourcePath, args.workerDir);
    const pageKey = inferPageKey(args.sourcePath);
    const timestamp = buildTimestampFromStat(stat.mtimeMs);
    const fileName = `${testCaseId}_${pageKey}_${timestamp}.json`;

    return path.join(args.pageScansDir, fileName);
}

async function copyFile(sourcePath: string, targetPath: string): Promise<void> {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.copyFile(sourcePath, targetPath);
}

export async function promoteWorkerPageScans(
    input: PromoteWorkerPageScansInput
): Promise<PromoteWorkerPageScansResult> {
    const paths = buildRunPaths(input.runId, input.outputRoot);
    const workerDirs = await listWorkerDirs(paths.baseDir);

    let promotedFileCount = 0;

    for (const workerDir of workerDirs) {
        const pageScanFiles = await collectPageScanFiles(workerDir);

        for (const sourcePath of pageScanFiles) {
            const targetPath = await buildTargetPath({
                sourcePath,
                workerDir,
                pageScansDir: paths.pageScansDir,
            });

            await copyFile(sourcePath, targetPath);
            promotedFileCount += 1;
        }
    }

    return {
        promotedFileCount,
        pageScansDir: paths.pageScansDir,
    };
}
