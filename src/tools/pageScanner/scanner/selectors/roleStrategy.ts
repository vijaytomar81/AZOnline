// src/tools/pageScanner/scanner/selectors/roleStrategy.ts

import type { ScannedElement, SelectorCandidate } from "../types";
import { escapeForRegex } from "@utils/regex";
import { normalizeSpaces } from "@utils/text";
import { inferRoleFromTag, scoreRole } from "./shared";

export function buildRoleSelectors(el: ScannedElement): SelectorCandidate[] {
    const candidates: SelectorCandidate[] = [];
    const role = el.role ?? inferRoleFromTag(el.tag, el.href);
    const nm = (el.text || el.name || el.labelText || el.ariaLabel || "").trim();

    if (!role || !nm) {
        return candidates;
    }

    const rx = escapeForRegex(normalizeSpaces(nm));

    if (role === "alert" || role === "dialog") {
        candidates.push({
            kind: "role",
            selector: `role=${role}`,
            score: scoreRole(66),
            reason: `${role} role`,
        });

        return candidates;
    }

    candidates.push({
        kind: "role",
        selector: `role=${role}[name=/${rx}/i]`,
        score: scoreRole(65),
        reason: "role+name",
    });

    return candidates;
}