import type { ScannedElement } from "../types";
import {
    isClickable,
    isVerboseImplementationId,
    pickBestElementBase,
} from "./heuristics";
import { normalizeBusinessPhrase, toKeyPreservingIdentifiers } from "./normalize";

function buildDisplayCandidate(el: ScannedElement): string | undefined {
    const raw =
        normalizeBusinessPhrase(el.text) ||
        normalizeBusinessPhrase(el.ariaLabel) ||
        normalizeBusinessPhrase(el.labelText) ||
        normalizeBusinessPhrase(el.name);

    return toKeyPreservingIdentifiers(raw);
}

function isTooGenericDisplayKey(value?: string): boolean {
    if (!value) return true;

    return /^(clickHere|learnMore|readMore|continue|next|previous|back|submit|open|close|yes|no)$/i.test(value);
}

function shouldPreferDisplayOverId(el: ScannedElement, displayKey?: string, ownBase?: string): boolean {
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