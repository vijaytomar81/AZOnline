// src/toolingLayer/pageActions/generator/core/manifestSync/writePageActionManifestIndex.ts

import fs from "node:fs";
import path from "node:path";
import type { PageActionManifestIndex } from "../../manifest/types";

function toJsonText(index: PageActionManifestIndex): string {
    return `${JSON.stringify(index, null, 2)}\n`;
}

function sameActionsMap(
    left: Record<string, string>,
    right: Record<string, string>
): boolean {
    const leftKeys = Object.keys(left).sort((a, b) => a.localeCompare(b));
    const rightKeys = Object.keys(right).sort((a, b) => a.localeCompare(b));

    if (leftKeys.length !== rightKeys.length) {
        return false;
    }

    for (let i = 0; i < leftKeys.length; i++) {
        const key = leftKeys[i];
        if (key !== rightKeys[i]) {
            return false;
        }

        if (left[key] !== right[key]) {
            return false;
        }
    }

    return true;
}

export function writePageActionManifestIndex(args: {
    filePath: string;
    index: PageActionManifestIndex;
}): boolean {
    fs.mkdirSync(path.dirname(args.filePath), { recursive: true });

    const current = fs.existsSync(args.filePath)
        ? (JSON.parse(fs.readFileSync(args.filePath, "utf8")) as Partial<PageActionManifestIndex>)
        : null;

    if (
        current &&
        current.actions &&
        typeof current.actions === "object" &&
        sameActionsMap(current.actions as Record<string, string>, args.index.actions)
    ) {
        return false;
    }

    const next: PageActionManifestIndex = {
        version: 1,
        generatedAt: new Date().toISOString(),
        actions: Object.fromEntries(
            Object.entries(args.index.actions).sort(([a], [b]) => a.localeCompare(b))
        ),
    };

    fs.writeFileSync(args.filePath, toJsonText(next), "utf8");
    return true;
}
