// src/toolingLayer/pageScanner/scanner/pageMap/diffPageMaps.ts

import type { PageMap, PageMapEntry } from "../types";

export type PageMapDiff = {
    added: string[];
    updated: string[];
    removed: string[];
    unchanged: string[];
};

function stableStringify(value: unknown): string {
    if (value === null || value === undefined) return String(value);

    if (Array.isArray(value)) {
        return `[${value.map(stableStringify).join(",")}]`;
    }

    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;
        const keys = Object.keys(obj).sort();
        return `{${keys.map((k) => `${k}:${stableStringify(obj[k])}`).join(",")}}`;
    }

    return JSON.stringify(value);
}

function areEntriesEqual(a: PageMapEntry, b: PageMapEntry): boolean {
    return stableStringify(a) === stableStringify(b);
}

export function diffPageMaps(before: PageMap, after: PageMap): PageMapDiff {
    const beforeKeys = new Set(Object.keys(before.elements));
    const afterKeys = new Set(Object.keys(after.elements));

    const added: string[] = [];
    const updated: string[] = [];
    const removed: string[] = [];
    const unchanged: string[] = [];

    for (const key of afterKeys) {
        if (!beforeKeys.has(key)) {
            added.push(key);
            continue;
        }

        const beforeEntry = before.elements[key];
        const afterEntry = after.elements[key];

        if (areEntriesEqual(beforeEntry, afterEntry)) {
            unchanged.push(key);
        } else {
            updated.push(key);
        }
    }

    for (const key of beforeKeys) {
        if (!afterKeys.has(key)) {
            removed.push(key);
        }
    }

    added.sort();
    updated.sort();
    removed.sort();
    unchanged.sort();

    return {
        added,
        updated,
        removed,
        unchanged,
    };
}