// src/toolingLayer/pageScanner/scanner/selectors/textStrategy.ts

import type { ScannedElement, SelectorCandidate } from "../types";
import { escapeForRegex } from "@utils/regex";
import { normalizeSpaces } from "@utils/text";
import { inferRoleFromTag, scoreText } from "./shared";

export function buildTextSelectors(el: ScannedElement): SelectorCandidate[] {
    const candidates: SelectorCandidate[] = [];

    const role = el.role ?? inferRoleFromTag(el.tag, el.href);
    const nm = (el.text || el.name || el.labelText || el.ariaLabel || "").trim();

    if ((role === "alert" || role === "dialog") && nm) {
        const rx = escapeForRegex(normalizeSpaces(nm));
        candidates.push({
            kind: "text",
            selector: `text=/${rx}/i`,
            score: scoreText(64),
            reason: `${role} text`,
        });
    }

    if (el.text) {
        const rx = escapeForRegex(normalizeSpaces(el.text));
        candidates.push({
            kind: "text",
            selector: `text=/${rx}/i`,
            score: scoreText(50),
            reason: "text",
        });
    }

    return candidates;
}