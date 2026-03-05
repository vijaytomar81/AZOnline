// src/tools/page-scanner/scanner/classify.ts

import type { ScannedElement } from "./types";

export function classifyType(el: ScannedElement): string {
    // Placeholder: later move your classifyType() here
    return el.role || el.tag || "element";
}