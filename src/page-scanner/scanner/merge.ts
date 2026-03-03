// src/scanner/page-scanner/merge.ts

import type { PageMap } from "./types";

export function mergePageMaps(existing: PageMap, incoming: PageMap): PageMap {
    // Placeholder: later move your merge logic here.
    return {
        ...existing,
        ...incoming,
        elements: { ...existing.elements, ...incoming.elements },
    };
}