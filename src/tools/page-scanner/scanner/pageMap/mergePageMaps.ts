// src/tools/page-scanner/scanner/pageMap/mergePageMaps.ts

import type { PageMap, PageMapElementEntry, PageMapEntry } from "../types";

function isGroupEntry(
    entry: PageMapEntry
): entry is Extract<PageMapEntry, { type: "radio-group" | "checkbox-group" }> {
    return entry.type === "radio-group" || entry.type === "checkbox-group";
}

function isElementEntry(entry: PageMapEntry): entry is PageMapElementEntry {
    return !isGroupEntry(entry);
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
        fallbacks = Array.from(new Set([...(cur.fallbacks ?? []), ...(next.fallbacks ?? [])]));
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
    cur: Extract<PageMapEntry, { type: "radio-group" | "checkbox-group" }>,
    next: Extract<PageMapEntry, { type: "radio-group" | "checkbox-group" }>
): Extract<PageMapEntry, { type: "radio-group" | "checkbox-group" }> {
    return {
        ...cur,
        ...next,
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

    for (const [existingKey, existingElement] of Object.entries(existing.elements)) {
        if ("stableKey" in existingElement && existingElement.stableKey) {
            existingKeyByStableKey.set(existingElement.stableKey, existingKey);
        }
    }

    for (const [incomingKey, incomingElement] of Object.entries(incoming.elements)) {
        const matchedExistingKey =
            out.elements[incomingKey]
                ? incomingKey
                : "stableKey" in incomingElement && incomingElement.stableKey
                    ? existingKeyByStableKey.get(incomingElement.stableKey)
                    : undefined;

        if (!matchedExistingKey) {
            out.elements[incomingKey] = incomingElement;

            if ("stableKey" in incomingElement && incomingElement.stableKey) {
                existingKeyByStableKey.set(incomingElement.stableKey, incomingKey);
            }
            continue;
        }

        const currentElement = out.elements[matchedExistingKey];

        if (isElementEntry(currentElement) && isElementEntry(incomingElement)) {
            out.elements[matchedExistingKey] = mergeElement(currentElement, incomingElement);
            continue;
        }

        if (isGroupEntry(currentElement) && isGroupEntry(incomingElement)) {
            out.elements[matchedExistingKey] = mergeGroupEntry(currentElement, incomingElement);
            continue;
        }

        out.elements[matchedExistingKey] = incomingElement;
    }

    return out;
}