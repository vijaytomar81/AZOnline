// src/tools/pageScanner/scanner/selectors/buildSelectors.ts

import type { ScannedElement, SelectorCandidate } from "../types";
import { getElementTag, scoreCss } from "./shared";
import { buildCssSelectors } from "./cssStrategy";
import { buildRoleSelectors } from "./roleStrategy";
import { buildTextSelectors } from "./textStrategy";

function dedupeSelectors(candidates: SelectorCandidate[]): SelectorCandidate[] {
    const seen = new Set<string>();
    const deduped: SelectorCandidate[] = [];

    for (const candidate of candidates) {
        if (seen.has(candidate.selector)) continue;
        seen.add(candidate.selector);
        deduped.push(candidate);
    }

    return deduped;
}

export function buildSelectors(el: ScannedElement): SelectorCandidate[] {
    const candidates: SelectorCandidate[] = [
        ...buildCssSelectors(el),
        ...buildRoleSelectors(el),
        ...buildTextSelectors(el),
    ];

    if (!candidates.length) {
        candidates.push({
            kind: "css",
            selector: `css=${getElementTag(el)}`,
            score: scoreCss(1),
            reason: "fallback tag",
        });
    }

    candidates.sort((a, b) => b.score - a.score);

    return dedupeSelectors(candidates);
}