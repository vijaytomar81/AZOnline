// src/tools/page-scanner/scanner/getSmartElementsKey.ts

import type { ScannedElement } from "./types";
import { toCamelFromText } from "../../../utils/text";

function clean(value?: string | null): string | undefined {
    const v = value?.replace(/\s+/g, " ").trim();
    return v ? v : undefined;
}

function isReactSelectInput(id?: string | null): boolean {
    return !!id && /^react-select-\d+-input$/i.test(id);
}

function isWeakValue(value?: string | null): boolean {
    const v = clean(value);
    if (!v) return true;

    // numeric-only like "1", "2"
    if (/^\d+$/.test(v)) return true;

    // symbols only
    if (/^[^a-zA-Z0-9]+$/.test(v)) return true;

    // framework-ish ids
    if (/^react-select-\d+-input$/i.test(v)) return true;

    return false;
}

function normalizeOptionText(value?: string | null): string | undefined {
    const v = clean(value);
    if (!v) return undefined;

    // Common friendly normalizations
    const lowered = v.toLowerCase();

    if (lowered === "yes") return "Yes";
    if (lowered === "no") return "No";

    if (/^less than\s+\d+\s+year(s)?$/i.test(v)) {
        return toCamelFromText(v);
    }

    // 1 - 2 years => 1 To 2 Years
    if (/^\d+\s*-\s*\d+\s+year(s)?$/i.test(v)) {
        return toCamelFromText(v.replace(/\s*-\s*/g, " to "));
    }

    return toCamelFromText(v);
}

function pickBestOwnerBase(el: ScannedElement): string | undefined {
    const candidates = [
        clean(el.ownerId),
        clean(el.ownerLabelText),
        clean(el.ownerAriaLabel),
        clean(el.labelText),
        clean(el.ariaLabel),
        clean(el.placeholder),
        clean(el.inputName),
        clean(el.name),
        clean(el.id),
    ];

    for (const c of candidates) {
        if (!isWeakValue(c)) {
            return toCamelFromText(c!);
        }
    }

    return undefined;
}

function shouldUseOwnerContext(el: ScannedElement): boolean {
    return (
        isReactSelectInput(el.id) ||
        !!el.isFrameworkSearchInput ||
        (!!el.ownerId && isWeakValue(el.id))
    );
}

function buildRadioCheckboxKey(el: ScannedElement): string | undefined {
    const type = (el.typeAttr || "").toLowerCase();
    if (type !== "radio" && type !== "checkbox") return undefined;

    const groupBase = pickBestOwnerBase({
        ...el,
        // for radios/checkboxes prefer inputName first
        ownerId: el.inputName ?? el.ownerId ?? null,
        labelText: el.ownerLabelText ?? el.labelText ?? null,
    });

    const optionBase = normalizeOptionText(el.labelText || el.text || el.name);

    if (groupBase && optionBase) {
        return `${groupBase}${optionBase[0]?.toUpperCase() || ""}${optionBase.slice(1)}`;
    }

    if (groupBase) return groupBase;

    return undefined;
}

function buildFrameworkSearchKey(el: ScannedElement): string | undefined {
    if (!shouldUseOwnerContext(el)) return undefined;

    const ownerBase = pickBestOwnerBase(el);
    if (!ownerBase) return undefined;

    return `${ownerBase}SearchInput`;
}

function buildGenericKey(el: ScannedElement, indexHint: number): string {
    const base = pickBestOwnerBase(el);
    if (base) return base;

    return toCamelFromText(`${el.tag || "element"} ${indexHint}`);
}

export function getSmartElementKey(el: ScannedElement, indexHint: number): string {
    const radioOrCheckboxKey = buildRadioCheckboxKey(el);
    if (radioOrCheckboxKey) return radioOrCheckboxKey;

    const frameworkSearchKey = buildFrameworkSearchKey(el);
    if (frameworkSearchKey) return frameworkSearchKey;

    return buildGenericKey(el, indexHint);
}