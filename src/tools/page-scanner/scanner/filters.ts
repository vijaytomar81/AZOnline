// src/tools/page-scanner/scanner/filters.ts

import type { ScannedElement } from "./types";

export type ElementFilter = (el: ScannedElement) => boolean;

export function applyFilters(elements: ScannedElement[], filters: ElementFilter[] = []) {
    if (!filters.length) return elements;
    return elements.filter((el) => filters.every((fn) => fn(el)));
}

/**
 * Placeholder: later we’ll implement:
 * - keep only inside #root
 * - exclude footer
 */
export const defaultFilters: ElementFilter[] = [];