// src/toolingLayer/pageObjects/generator/generator/syncElementsTs.ts

import fs from "node:fs";

import type { PageMap, PageMapElement } from "./types";
import { buildElementsTs } from "../builders/buildElementsTs";

type ParsedEntry = { key: string; value: PageMapElement };
type SyncResult = { changed: boolean; renameMap: Record<string, string>; addedKeys: string[] };

function parseElementsFile(filePath: string): ParsedEntry[] {
    if (!fs.existsSync(filePath)) return [];
    const txt = fs.readFileSync(filePath, "utf8");
    const body = txt.match(/export const elements = \{([\s\S]*?)\}\s*as const;/m)?.[1] ?? "";
    const re = /^\s*(?:"([^"]+)"|([A-Za-z_$][A-Za-z0-9_$]*)):\s*\{([\s\S]*?)^\s*\},?$/gm;
    const out: ParsedEntry[] = [];
    let match: RegExpExecArray | null;

    while ((match = re.exec(body))) {
        const key = match[1] ?? match[2];
        const block = match[3] ?? "";
        if (!key) continue;

        const value: PageMapElement = {
            type: block.match(/type:\s*"([^"]*)"/)?.[1] ?? "button",
            preferred: block.match(/preferred:\s*"([^"]*)"/)?.[1] ?? "",
            fallbacks: [...(block.match(/fallbacks:\s*\[([\s\S]*?)\]/)?.[1] ?? "").matchAll(/"((?:\\"|[^"])*)"/g)].map(
                (m) => m[1]!.replace(/\\"/g, "\"")
            ),
            stableKey: block.match(/stableKey:\s*"([^"]*)"/)?.[1],
        };

        out.push({ key, value });
    }

    return out;
}

export function syncElementsTs(filePath: string, pageMap: PageMap): SyncResult {
    const existing = parseElementsFile(filePath);
    const existingByKey = new Map(existing.map((e) => [e.key, e]));
    const existingByStable = new Map(existing.filter((e) => e.value.stableKey).map((e) => [e.value.stableKey!, e]));
    const order = existing.map((e) => e.key);
    const next = new Map(existing.map((e) => [e.key, e.value]));
    const renameMap: Record<string, string> = {};
    const addedKeys: string[] = [];

    for (const [desiredKey, desiredValue] of Object.entries(pageMap.elements)) {
        if (existingByKey.has(desiredKey)) {
            next.set(desiredKey, desiredValue);
            continue;
        }

        const renamed = desiredValue.stableKey ? existingByStable.get(desiredValue.stableKey) : undefined;
        if (renamed && renamed.key !== desiredKey) {
            next.delete(renamed.key);
            next.set(desiredKey, desiredValue);
            renameMap[renamed.key] = desiredKey;
            const idx = order.indexOf(renamed.key);
            if (idx >= 0) order[idx] = desiredKey;
            continue;
        }

        next.set(desiredKey, desiredValue);
        order.push(desiredKey);
        addedKeys.push(desiredKey);
    }

    const mergedMap: PageMap = {
        ...pageMap,
        elements: Object.fromEntries(order.filter((key) => next.has(key)).map((key) => [key, next.get(key)!])),
    };

    const oldText = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
    const nextText = buildElementsTs(mergedMap);

    if (oldText === nextText) {
        return { changed: false, renameMap: {}, addedKeys: [] };
    }

    fs.writeFileSync(filePath, nextText, "utf8");
    return { changed: true, renameMap, addedKeys };
}