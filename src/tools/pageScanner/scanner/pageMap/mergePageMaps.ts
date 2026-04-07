// src/tools/pageScanner/scanner/pageMap/mergePageMaps.ts

import type { PageMap, PageMapElementEntry, PageMapEntry, PageMapGroupEntry } from "../types";

function isGroupEntry(entry: PageMapEntry): entry is PageMapGroupEntry {
    return entry.type === "radio-group" || entry.type === "checkbox-group";
}

function isElementEntry(entry: PageMapEntry): entry is PageMapElementEntry {
    return !isGroupEntry(entry);
}

function getStableKey(entry: PageMapEntry): string | undefined {
    return "stableKey" in entry ? entry.stableKey : undefined;
}

function mergeElement(cur: PageMapElementEntry, next: PageMapElementEntry): PageMapElementEntry {
    let preferred = cur.preferred;
    let fallbacks = [...(cur.fallbacks ?? [])];

    if (preferred !== next.preferred) {
        fallbacks = Array.from(
            new Set(
                [preferred, ...fallbacks, ...(next.fallbacks ?? [])].filter(
                    (x) => x && x !== next.preferred
                )
            )
        );
        preferred = next.preferred;
    } else {
        fallbacks = Array.from(
            new Set([...(cur.fallbacks ?? []), ...(next.fallbacks ?? [])])
        );
    }

    return {
        ...cur,
        ...next,
        stableKey: cur.stableKey ?? next.stableKey,
        preferred,
        fallbacks,
        meta: {
            ...(cur.meta ?? {}),
            ...(next.meta ?? {}),
            tag: next.meta?.tag ?? cur.meta?.tag ?? "element",
        },
    };
}

function mergeGroupEntry(
    cur: PageMapGroupEntry,
    next: PageMapGroupEntry
): PageMapGroupEntry {
    return {
        ...cur,
        ...next,
        stableKey: cur.stableKey ?? next.stableKey,
        options: {
            ...(cur.options ?? {}),
            ...(next.options ?? {}),
        },
        meta: {
            ...(cur.meta ?? {}),
            ...(next.meta ?? {}),
        },
    };
}

export function mergePageMaps(existing: PageMap, incoming: PageMap): PageMap {
    const out: PageMap = {
        ...existing,
        pageKey: existing.pageKey || incoming.pageKey,
        url: incoming.url || existing.url,
        urlPath: incoming.urlPath ?? existing.urlPath,
        scannedAt: incoming.scannedAt,
        title: incoming.title ?? existing.title,
        elements: { ...existing.elements },
    };

    const existingKeyByStableKey = new Map<string, string>();

    for (const [existingKey, existingEntry] of Object.entries(existing.elements)) {
        const stableKey = getStableKey(existingEntry);
        if (stableKey) {
            existingKeyByStableKey.set(stableKey, existingKey);
        }
    }

    for (const [incomingKey, incomingEntry] of Object.entries(incoming.elements)) {
        const incomingStableKey = getStableKey(incomingEntry);

        const matchedExistingKey =
            out.elements[incomingKey]
                ? incomingKey
                : incomingStableKey
                    ? existingKeyByStableKey.get(incomingStableKey)
                    : undefined;

        if (!matchedExistingKey) {
            out.elements[incomingKey] = incomingEntry;

            if (incomingStableKey) {
                existingKeyByStableKey.set(incomingStableKey, incomingKey);
            }
            continue;
        }

        const currentEntry = out.elements[matchedExistingKey];

        if (isElementEntry(currentEntry) && isElementEntry(incomingEntry)) {
            out.elements[matchedExistingKey] = mergeElement(currentEntry, incomingEntry);
            continue;
        }

        if (isGroupEntry(currentEntry) && isGroupEntry(incomingEntry)) {
            out.elements[matchedExistingKey] = mergeGroupEntry(currentEntry, incomingEntry);
            continue;
        }

        // Fallback: if entry kinds changed, prefer latest scan but keep manual key
        out.elements[matchedExistingKey] = incomingEntry;
    }

    return out;
}