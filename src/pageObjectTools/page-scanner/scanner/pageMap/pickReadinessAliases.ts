// src/pageObjectTools/page-scanner/scanner/pageMap/pickReadinessAliases.ts

import type {
    PageMap,
    PageMapElementEntry,
    PageMapEntry,
    PageMapGroupEntry,
} from "../types";

type Candidate = {
    aliasKey: string;
    type: string;
    score: number;
};

function isElementEntry(entry: PageMapEntry): entry is PageMapElementEntry {
    return "preferred" in entry && "fallbacks" in entry && !("options" in entry);
}

function isGroupEntry(entry: PageMapEntry): entry is PageMapGroupEntry {
    return "options" in entry;
}

function getText(entry: PageMapEntry): string {
    const parts: string[] = [];

    if (isElementEntry(entry)) {
        parts.push(
            entry.meta?.name ?? "",
            entry.meta?.text ?? "",
            entry.meta?.labelText ?? "",
            entry.meta?.ariaLabel ?? "",
            entry.meta?.ownerLabelText ?? "",
            entry.meta?.ownerAriaLabel ?? ""
        );
    }

    if (isGroupEntry(entry)) {
        parts.push(
            entry.meta?.ownerLabelText ?? "",
            entry.meta?.ownerAriaLabel ?? "",
            entry.meta?.inputName ?? ""
        );
    }

    return parts.join(" ").toLowerCase();
}

function scoreEntry(aliasKey: string, entry: PageMapEntry): number {
    const alias = aliasKey.toLowerCase();
    const text = getText(entry);
    let score = 0;

    if (entry.type === "input") score += 30;
    if (entry.type === "select") score += 26;
    if (entry.type === "radio-group") score += 24;
    if (entry.type === "button") score += 18;
    if (entry.type === "radio") score += 8;
    if (entry.type === "link") score -= 35;

    if (isElementEntry(entry) && entry.stableKey) score += 10;
    if (isElementEntry(entry) && entry.meta?.labelText) score += 8;
    if (isElementEntry(entry) && entry.meta?.ownerLabelText) score += 8;
    if (isGroupEntry(entry) && entry.meta?.ownerLabelText) score += 10;

    if (text.includes("first name")) score += 20;
    if (text.includes("last name")) score += 18;
    if (text.includes("title")) score += 14;
    if (text.includes("date of birth")) score += 10;
    if (text.includes("next")) score += 16;
    if (text.includes("continue")) score += 16;
    if (text.includes("submit")) score += 16;
    if (text.includes("find address")) score += 10;

    if (alias.includes("homepage") || text.includes("home page")) score -= 100;
    if (alias.includes("back") || text.includes("back")) score -= 60;
    if (alias.includes("remove") || text.includes("remove")) score -= 80;
    if (alias.includes("addanother") || text.includes("add another")) score -= 40;

    if (isElementEntry(entry) && entry.meta?.isFrameworkSearchInput) score -= 50;

    return score;
}

export function pickReadinessAliases(pageMap: PageMap): string[] {
    const candidates: Candidate[] = Object.entries(pageMap.elements)
        .map(([aliasKey, entry]) => ({
            aliasKey,
            type: entry.type,
            score: scoreEntry(aliasKey, entry),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || a.aliasKey.localeCompare(b.aliasKey));

    const selected: string[] = [];
    const usedKinds = new Set<string>();

    for (const item of candidates) {
        const kind =
            item.type === "button"
                ? "cta"
                : item.type === "input" || item.type === "select" || item.type === "radio-group"
                    ? "field"
                    : item.type;

        if (kind === "field") {
            const fieldCount = selected.filter((key) => {
                const type = pageMap.elements[key]?.type;
                return type === "input" || type === "select" || type === "radio-group";
            }).length;

            if (fieldCount >= 2) {
                continue;
            }
        }

        if (kind === "cta" && usedKinds.has("cta")) {
            continue;
        }

        selected.push(item.aliasKey);
        usedKinds.add(kind);

        if (selected.length >= 3) {
            break;
        }
    }

    return selected;
}
