// src/pageObjectTools/page-object-generator/generator/syncAliasesGenerated.ts

import fs from "node:fs";

import type { PageMap } from "./types";
import { buildAliasesGeneratedTs } from "../builders/buildAliasesGeneratedTs";

type SyncResult = {
    changed: boolean;
    addedKeys: string[];
    renameMap: Record<string, string>;
};

function parseAliasesGeneratedKeys(filePath: string): string[] {
    if (!fs.existsSync(filePath)) return [];

    const txt = fs.readFileSync(filePath, "utf8");
    return [...txt.matchAll(/^\s*(?:"([^"]+)"|([A-Za-z_$][A-Za-z0-9_$]*)):\s*"[^"]+"\s+as ElementKey,/gm)]
        .map((m) => m[1] ?? m[2] ?? "")
        .filter(Boolean);
}

export function syncAliasesGeneratedFile(
    filePath: string,
    pageMap: PageMap,
    renameMap: Record<string, string>,
    addedElementKeys: string[]
): SyncResult {
    const existingKeys = parseAliasesGeneratedKeys(filePath);
    const nextKeys = [...existingKeys];

    for (const [oldKey, newKey] of Object.entries(renameMap)) {
        const idx = nextKeys.indexOf(oldKey);
        if (idx >= 0) nextKeys[idx] = newKey;
        else if (!nextKeys.includes(newKey)) nextKeys.push(newKey);
    }

    for (const key of addedElementKeys) {
        if (!nextKeys.includes(key)) nextKeys.push(key);
    }

    const mergedElements = Object.fromEntries(
        nextKeys.map((key) => [key, pageMap.elements[key] ?? { type: "button", preferred: "", fallbacks: [] }])
    );

    const oldText = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
    const nextText = buildAliasesGeneratedTs({
        ...pageMap,
        elements: mergedElements,
    });

    if (oldText === nextText) {
        return { changed: false, addedKeys: [], renameMap: {} };
    }

    fs.writeFileSync(filePath, nextText, "utf8");
    return { changed: true, addedKeys: addedElementKeys, renameMap };
}