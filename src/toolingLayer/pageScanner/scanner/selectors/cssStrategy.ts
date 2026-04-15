// src/toolingLayer/pageScanner/scanner/selectors/cssStrategy.ts

import type { ScannedElement, SelectorCandidate } from "../types";
import { getElementTag, scoreCss } from "./shared";

export function buildCssSelectors(el: ScannedElement): SelectorCandidate[] {
    const candidates: SelectorCandidate[] = [];
    const tag = getElementTag(el);

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

    if (el.id) {
        candidates.push({
            kind: "css",
            selector: `css=#${el.id}`,
            score: scoreCss(85),
            reason: "id",
        });
    }

    if (el.inputName) {
        candidates.push({
            kind: "css",
            selector: `css=${tag}[name="${el.inputName}"]`,
            score: scoreCss(82),
            reason: "name attribute",
        });
    }

    if (el.ariaLabel) {
        candidates.push({
            kind: "css",
            selector: `css=${tag}[aria-label="${el.ariaLabel}"]`,
            score: scoreCss(80),
            reason: "aria-label",
        });
    }

    if (el.placeholder) {
        candidates.push({
            kind: "css",
            selector: `css=${tag}[placeholder="${el.placeholder}"]`,
            score: scoreCss(70),
            reason: "placeholder",
        });
    }

    return candidates;
}