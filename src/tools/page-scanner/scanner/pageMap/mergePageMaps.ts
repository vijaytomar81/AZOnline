// \src/tools/page-scanner/scanner/pageMap/mergePageMaps.ts

import { uniq } from "../../../../utils/collections";
import type { PageMap, PageMapEntry, PageMapGroupEntry } from "../types";

function isGroupEntry(entry: PageMapEntry): entry is PageMapGroupEntry {
    return entry.type === "radio-group" || entry.type === "checkbox-group";
}

/**
 * Merge strategy:
 * - Keep existing keys stable.
 * - If preferred differs, keep old as fallback and promote new preferred.
 * - Union fallbacks.
 * - Merge meta where possible.
 * - Group entries are replaced by incoming version.
 */
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

    for (const key of Object.keys(incoming.elements)) {
        const next = incoming.elements[key];
        const cur = out.elements[key];

        if (!cur) {
            out.elements[key] = next;
            continue;
        }

        if (isGroupEntry(next) || isGroupEntry(cur)) {
            out.elements[key] = next;
            continue;
        }

        let preferred = cur.preferred;
        let fallbacks = uniq([...(cur.fallbacks ?? [])]);

        if (preferred !== next.preferred) {
            fallbacks = uniq(
                [preferred, ...fallbacks, ...(next.fallbacks ?? [])].filter(
                    (x) => x !== next.preferred
                )
            );
            preferred = next.preferred;
        } else {
            fallbacks = uniq([...(cur.fallbacks ?? []), ...(next.fallbacks ?? [])]);
        }

        out.elements[key] = {
            ...cur,
            type: cur.type || next.type,
            preferred,
            fallbacks,
            meta: {
                ...(cur.meta ?? {}),
                ...(next.meta ?? {}),
                tag: next.meta?.tag ?? cur.meta?.tag ?? cur.type ?? next.type ?? "element",
            },
        };
    }

    return out;
}