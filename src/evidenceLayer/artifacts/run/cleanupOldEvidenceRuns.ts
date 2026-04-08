// src/evidenceLayer/artifacts/run/cleanupOldEvidenceRuns.ts

import fs from "node:fs/promises";
import path from "node:path";
import { EVIDENCE_OUTPUT_ROOT } from "@utils/paths";

export type CleanupOldEvidenceRunsInput = {
    outputRoot?: string;
    maxToKeep: number;
    excludeRunIds?: string[];
};

type DirectoryEntryInfo = {
    name: string;
    fullPath: string;
    mtimeMs: number;
};

async function readRunDirectories(
    outputRoot: string
): Promise<DirectoryEntryInfo[]> {
    let entries: string[] = [];

    try {
        entries = await fs.readdir(outputRoot);
    } catch {
        return [];
    }

    const result: DirectoryEntryInfo[] = [];

    for (const name of entries) {
        const fullPath = path.join(outputRoot, name);

        try {
            const stat = await fs.stat(fullPath);

            if (!stat.isDirectory()) {
                continue;
            }

            result.push({
                name,
                fullPath,
                mtimeMs: stat.mtimeMs,
            });
        } catch {
            continue;
        }
    }

    return result.sort((a, b) => b.mtimeMs - a.mtimeMs);
}

export async function cleanupOldEvidenceRuns(
    input: CleanupOldEvidenceRunsInput
): Promise<void> {
    const outputRoot = input.outputRoot ?? EVIDENCE_OUTPUT_ROOT;
    const maxToKeep = Math.max(1, input.maxToKeep);
    const excluded = new Set(input.excludeRunIds ?? []);
    const directories = await readRunDirectories(outputRoot);

    const kept: DirectoryEntryInfo[] = [];
    const removable: DirectoryEntryInfo[] = [];

    for (const dir of directories) {
        if (excluded.has(dir.name)) {
            kept.push(dir);
            continue;
        }

        if (kept.length < maxToKeep) {
            kept.push(dir);
            continue;
        }

        removable.push(dir);
    }

    await Promise.all(
        removable.map((dir) =>
            fs.rm(dir.fullPath, { recursive: true, force: true })
        )
    );
}