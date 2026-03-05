// src/tools/page-scanner/scanner/keyStrategy.ts

import type { ScannedElement } from "./types";

/**
 * Builds the base key for an element.
 * Placeholder: later we’ll move your label-first strategy here.
 */
export function buildBaseKey(el: ScannedElement, indexHint: number): string {
    return `${el.tag || "el"}-${indexHint}`;
}

export function normalizeKey(s: string) {
    return s;
}

export function ensureUniqueKey(base: string, used: Set<string>) {
    let key = base;
    let i = 2;
    while (!key || used.has(key)) {
        key = `${base}${i}`;
        i++;
    }
    used.add(key);
    return key;
}