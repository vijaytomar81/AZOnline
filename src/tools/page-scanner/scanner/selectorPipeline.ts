// src/tools/page-scanner/scanner/selectorPipeline.ts

import type { ScannedElement, SelectorCandidate } from "./types";
import { normalizeSpaces } from "../../../utils/text";
import { escapeForRegex } from "../../../utils/regex";

function scoreCss(base: number) {
    return base;
}
function scoreRole(base: number) {
    return base;
}
function scoreText(base: number) {
    return base;
}

function inferRoleFromTag(tag: string, href: string | null): string | null {
    const t = (tag || "").toLowerCase();
    if (t === "button") return "button";
    if (t === "a" && href) return "link";
    if (t === "input") return "textbox";
    if (t === "textarea") return "textbox";
    if (t === "select") return "combobox";
    return null;
}

/**
 * Enterprise: selector candidates with priority:
 * 1) data-testid / data-qa / data-test
 * 2) id
 * 3) input name
 * 4) aria-label
 * 5) placeholder
 * 6) role+name (regex)
 * 7) text regex (last resort)
 */
function buildCandidates(el: ScannedElement): SelectorCandidate[] {
    const candidates: SelectorCandidate[] = [];
    const tag = el.tag || "element";

    // --- 1) Highest: test/qa ids ---
    if (el.dataTestId) {
        candidates.push({
            kind: "css",
            selector: `css=[data-testid="${el.dataTestId}"]`,
            score: scoreCss(100),
            reason: "data-testid",
        });
    }
    if (el.dataQa) {
        candidates.push({
            kind: "css",
            selector: `css=[data-qa="${el.dataQa}"]`,
            score: scoreCss(95),
            reason: "data-qa",
        });
    }
    if (el.dataTest) {
        candidates.push({
            kind: "css",
            selector: `css=[data-test="${el.dataTest}"]`,
            score: scoreCss(90),
            reason: "data-test",
        });
    }

    // --- 2) ID ---
    if (el.id) {
        candidates.push({
            kind: "css",
            selector: `css=#${el.id}`,
            score: scoreCss(85),
            reason: "id",
        });
    }

    // --- 3) input name attribute ---
    if (el.inputName) {
        candidates.push({
            kind: "css",
            selector: `css=${tag}[name="${el.inputName}"]`,
            score: scoreCss(82),
            reason: "name attribute",
        });
    }

    // --- 4) aria-label ---
    if (el.ariaLabel) {
        candidates.push({
            kind: "css",
            selector: `css=${tag}[aria-label="${el.ariaLabel}"]`,
            score: scoreCss(80),
            reason: "aria-label",
        });
    }

    // --- 5) placeholder ---
    if (el.placeholder) {
        candidates.push({
            kind: "css",
            selector: `css=${tag}[placeholder="${el.placeholder}"]`,
            score: scoreCss(70),
            reason: "placeholder",
        });
    }

    // --- 6) Role + name ---
    const role = el.role ?? inferRoleFromTag(el.tag, el.href);
    const nm = (el.text || el.name || el.labelText || el.ariaLabel || "").trim();

    if (role && nm) {
        const rx = escapeForRegex(normalizeSpaces(nm));
        candidates.push({
            kind: "role",
            selector: `role=${role}[name=/${rx}/i]`,
            score: scoreRole(65),
            reason: "role+name",
        });
    }

    // --- 7) Text fallback ---
    if (el.text) {
        const rx = escapeForRegex(normalizeSpaces(el.text));
        candidates.push({
            kind: "text",
            selector: `text=/${rx}/i`,
            score: scoreText(50),
            reason: "text",
        });
    }

    // If nothing at all
    if (!candidates.length) {
        candidates.push({
            kind: "css",
            selector: `css=${tag}`,
            score: scoreCss(1),
            reason: "fallback tag",
        });
    }

    // Sort by score desc
    candidates.sort((a, b) => b.score - a.score);

    // Remove duplicates by selector (keep highest score version)
    const seen = new Set<string>();
    const deduped: SelectorCandidate[] = [];
    for (const c of candidates) {
        if (seen.has(c.selector)) continue;
        seen.add(c.selector);
        deduped.push(c);
    }

    return deduped;
}

/**
 * Keep existing pipeline API (so other files don't change)
 */
export function buildSelectors(el: ScannedElement) {
    return buildCandidates(el);
}