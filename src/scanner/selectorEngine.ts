// src/scanner/selectorEngine.ts
import type { ScannedElement, SelectorCandidate } from "./types";

function norm(s: string) {
    return s.trim().replace(/\s+/g, " ");
}

function toSafeKey(s: string) {
    return norm(s)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 40);
}

function escapeForRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scoreCss(reasonBase: number) {
    return reasonBase; // simple scoring hook
}

function scoreRole(reasonBase: number) {
    return reasonBase;
}

function scoreText(reasonBase: number) {
    return reasonBase;
}

export function buildCandidates(el: ScannedElement): SelectorCandidate[] {
    const candidates: SelectorCandidate[] = [];

    // --- Highest priority: test ids / QA ids ---
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

    // --- Next: ID ---
    if (el.id) {
        candidates.push({
            kind: "css",
            selector: `css=#${el.id}`,
            score: scoreCss(85),
            reason: "id",
        });
    }

    // --- Role + accessible-ish name (best cross-browser stable) ---
    const role = el.role ?? inferRoleFromTag(el.tag, el.href);
    const name = el.name ?? el.text;

    if (role && name) {
        const rx = escapeForRegex(norm(name));
        candidates.push({
            kind: "role",
            selector: `role=${role}[name=/${rx}/i]`,
            score: scoreRole(80),
            reason: "role+name",
        });
    }

    // --- Text fallback (last resort) ---
    if (el.text) {
        const rx = escapeForRegex(norm(el.text));
        candidates.push({
            kind: "text",
            selector: `text=/${rx}/i`,
            score: scoreText(50),
            reason: "text",
        });
    }

    // Order by score desc
    candidates.sort((a, b) => b.score - a.score);

    return candidates;
}

function inferRoleFromTag(tag: string, href: string | null): string | null {
    const t = tag.toLowerCase();
    if (t === "button") return "button";
    if (t === "a" && href) return "link";
    if (t === "input") return "textbox";
    if (t === "textarea") return "textbox";
    if (t === "select") return "combobox";
    return null;
}

export function inferKey(el: ScannedElement): string {
    const role = (el.role ?? inferRoleFromTag(el.tag, el.href) ?? el.tag).toLowerCase();

    const labelBase = el.name || el.text || el.id || el.dataTestId || el.dataQa || el.dataTest || "unnamed";
    const safe = toSafeKey(labelBase);

    return `${role}.${safe || "unnamed"}`;
}

export function pickBest(el: ScannedElement): ScannedElement {
    const candidates = buildCandidates(el);
    return { ...el, candidates, best: candidates[0], key: inferKey(el) };
}