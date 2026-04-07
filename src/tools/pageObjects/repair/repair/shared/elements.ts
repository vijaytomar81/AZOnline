// src/tools/pageObjects/repair/repair/shared/elements.ts

import fs from "node:fs";

import {
    extractExportedObjectBody,
    splitTopLevelObjectEntries,
} from "@pageObjectCommon/tsObjectParser";

export type ElementInfo = {
    key: string;
    type: string;
};

function extractKey(entry: string): string | undefined {
    const match = entry.match(/^(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][A-Za-z0-9_$]*))\s*:/);
    return match?.[1] ?? match?.[2] ?? match?.[3] ?? undefined;
}

function extractType(entry: string): string {
    const match = entry.match(/\btype\s*:\s*(?:"([^"]+)"|'([^']+)')/);
    return match?.[1] ?? match?.[2] ?? "button";
}

export function readElementsInfo(elementsPath: string): ElementInfo[] {
    if (!fs.existsSync(elementsPath)) return [];

    const tsText = fs.readFileSync(elementsPath, "utf8");
    const body = extractExportedObjectBody(tsText, "elements");
    if (!body) return [];

    return splitTopLevelObjectEntries(body)
        .map((entry) => {
            const key = extractKey(entry);
            if (!key) return null;
            return { key, type: extractType(entry) };
        })
        .filter((item): item is ElementInfo => Boolean(item));
}