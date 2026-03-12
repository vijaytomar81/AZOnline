// src/tools/page-scanner/scanner/keyNaming/strategies.ts
import type { ScannedElement } from "../types";
import {
    isClickable,
    isVerboseImplementationId,
    pickBestDisplayBase,
    pickBestElementBase,
    pickBestOwnerBase,
    shouldUseOwnerContext,
} from "./heuristics";
import { clean, normalizeBusinessPhrase, toKeyPreservingIdentifiers, upperFirst } from "./normalize";

function normalizeOptionText(value?: string | null): string | undefined {
    const v = clean(value);
    if (!v) return undefined;

    const lowered = v.toLowerCase();

    if (lowered === "yes") return "Yes";
    if (lowered === "no") return "No";

    const key = toKeyPreservingIdentifiers(v.replace(/\s*-\s*/g, " to "));
    return upperFirst(key);
}

export function buildRadioCheckboxKey(el: ScannedElement): string | undefined {
    const type = (el.typeAttr || "").toLowerCase();
    if (type !== "radio" && type !== "checkbox") return undefined;

    const groupBase = pickBestOwnerBase({
        ...el,
        ownerId: el.inputName ?? el.ownerId ?? null,
        labelText: el.ownerLabelText ?? el.labelText ?? null,
    });

    const optionBase = normalizeOptionText(el.labelText || el.text || el.name);

    if (groupBase && optionBase) return `${groupBase}${optionBase}`;
    if (groupBase) return groupBase;

    return undefined;
}

export function buildFrameworkSearchKey(el: ScannedElement): string | undefined {
    if (!shouldUseOwnerContext(el)) return undefined;

    const ownerBase = pickBestOwnerBase(el);
    if (!ownerBase) return undefined;

    return `${ownerBase}SearchInput`;
}

function buildNormalizedDisplayBase(el: ScannedElement): string | undefined {
    const candidates = [
        normalizeBusinessPhrase(el.text),
        normalizeBusinessPhrase(el.ariaLabel),
        normalizeBusinessPhrase(el.labelText),
        normalizeBusinessPhrase(el.name),
    ];

    for (const c of candidates) {
        const key = toKeyPreservingIdentifiers(c);
        if (key) return key;
    }

    return undefined;
}

export function buildGenericKey(el: ScannedElement, indexHint: number): string {
    const displayBase = buildNormalizedDisplayBase(el) || pickBestDisplayBase(el);
    const ownBase = pickBestElementBase(el);

    if (
        isClickable(el) &&
        displayBase &&
        ownBase &&
        el.id &&
        isVerboseImplementationId(el.id)
    ) {
        return displayBase;
    }

    if (displayBase && !ownBase) return displayBase;
    if (ownBase) return ownBase;

    const ownerBase = pickBestOwnerBase(el);
    if (ownerBase) return ownerBase;

    return toKeyPreservingIdentifiers(`${el.tag || "element"} ${indexHint}`) || `element${indexHint}`;
}