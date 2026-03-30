// src/pageObjectTools/page-scanner/scanner/keyNaming/heuristics.ts

import type { ScannedElement } from "../types";
import {
    clean,
    isReactSelectInput,
    isWeakValue,
    toKeyPreservingIdentifiers,
} from "./normalize";

export function isClickable(el: ScannedElement): boolean {
    const tag = (el.tag || "").toLowerCase();
    const role = (el.role || "").toLowerCase();
    return tag === "a" || tag === "button" || role === "link" || role === "button";
}

export function isSearchLikeField(el: ScannedElement): boolean {
    const tag = (el.tag || "").toLowerCase();
    const role = (el.role || "").toLowerCase();
    const type = (el.typeAttr || "").toLowerCase();

    return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        role === "textbox" ||
        role === "combobox" ||
        type === "search"
    );
}

export function shouldUseOwnerContext(el: ScannedElement): boolean {
    return (
        isReactSelectInput(el.id) ||
        !!el.isFrameworkSearchInput ||
        (isSearchLikeField(el) && !!el.ownerId && isWeakValue(el.id))
    );
}

export function splitIdentifierWords(value?: string | null): string[] {
    const v = clean(value);
    if (!v) return [];

    return v
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .split(/[\s_\-]+/)
        .filter(Boolean);
}

export function wordCount(value?: string | null): number {
    return splitIdentifierWords(value).length;
}

export function isVerboseImplementationId(value?: string | null): boolean {
    const v = clean(value);
    if (!v) return false;

    return (
        v.length >= 20 ||
        /saved|subscription|journey|process|wizard|panel|section|container|content|capture/i.test(v) ||
        wordCount(v) >= 4
    );
}

export function pickBestElementBase(el: ScannedElement): string | undefined {
    const candidates = [
        clean(el.id),
        clean(el.dataTestId),
        clean(el.dataTest),
        clean(el.dataQa),
        clean(el.inputName),
        clean(el.ariaLabel),
        clean(el.labelText),
        clean(el.placeholder),
        clean(el.text),
        clean(el.name),
    ];

    for (const c of candidates) {
        if (!isWeakValue(c)) return toKeyPreservingIdentifiers(c);
    }

    return undefined;
}

export function pickBestOwnerBase(el: ScannedElement): string | undefined {
    const candidates = [
        clean(el.inputName),
        clean(el.ownerGroupLabelFor),
        clean(el.ownerLabelText),
        clean(el.ownerAriaLabel),
        clean(el.ownerId),
        clean(el.labelText),
        clean(el.ariaLabel),
        clean(el.placeholder),
        clean(el.name),
        clean(el.id),
    ];

    for (const c of candidates) {
        if (!isWeakValue(c)) return toKeyPreservingIdentifiers(c);
    }

    return undefined;
}

export function pickBestDisplayBase(el: ScannedElement): string | undefined {
    const candidates = [
        clean(el.text),
        clean(el.ariaLabel),
        clean(el.labelText),
        clean(el.name),
    ];

    for (const c of candidates) {
        if (!isWeakValue(c)) return toKeyPreservingIdentifiers(c);
    }

    return undefined;
}