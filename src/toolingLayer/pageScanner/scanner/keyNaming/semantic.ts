// src/toolingLayer/pageScanner/scanner/keyNaming/semantic.ts

import type { ScannedElement } from "../types";
import {
    isClickable,
    isVerboseImplementationId,
    pickBestElementBase,
} from "./heuristics";
import { clean, normalizeBusinessPhrase, toKeyPreservingIdentifiers } from "./normalize";

function buildDisplayCandidate(el: ScannedElement): string | undefined {
    const textCandidate = normalizeBusinessPhrase(el.text);
    const ariaCandidate = normalizeBusinessPhrase(el.ariaLabel);
    const labelCandidate = normalizeBusinessPhrase(el.labelText);
    const nameCandidate = normalizeBusinessPhrase(el.name);

    const raw =
        (!isWeakActionText(textCandidate) ? textCandidate : undefined) ||
        (!isWeakActionText(ariaCandidate) ? ariaCandidate : undefined) ||
        (!isWeakActionText(labelCandidate) ? labelCandidate : undefined) ||
        (!isWeakActionText(nameCandidate) ? nameCandidate : undefined);

    return toKeyPreservingIdentifiers(raw);
}

function isWeakActionText(value?: string | null): boolean {
    const v = clean(value)?.toLowerCase();
    if (!v) return true;

    return [
        "click here",
        "here",
        "select",
        "choose",
        "continue",
        "next",
        "previous",
        "back",
        "submit",
        "open",
        "close",
        "ok",
        "yes",
        "no",
        "learn more",
        "read more",
        "more",
    ].includes(v);
}

function isTooGenericDisplayKey(value?: string): boolean {
    if (!value) return true;

    return /^(clickHere|here|select|choose|continue|next|previous|back|submit|open|close|ok|yes|no|learnMore|readMore|more)$/i.test(
        value
    );
}

function shouldPreferDisplayOverId(
    el: ScannedElement,
    displayKey?: string,
    ownBase?: string
): boolean {
    if (!displayKey) return false;
    if (!ownBase) return true;
    if (!el.id) return true;

    if (isVerboseImplementationId(el.id)) return true;
    if (ownBase.length >= displayKey.length + 10) return true;

    return false;
}

export function buildSemanticKey(el: ScannedElement): string | undefined {
    if (!isClickable(el)) return undefined;

    const displayKey = buildDisplayCandidate(el);
    const ownBase = pickBestElementBase(el);

    if (!displayKey && !ownBase) return undefined;

    if (displayKey && !isTooGenericDisplayKey(displayKey)) {
        if (shouldPreferDisplayOverId(el, displayKey, ownBase)) {
            return displayKey;
        }
    }

    return undefined;
}