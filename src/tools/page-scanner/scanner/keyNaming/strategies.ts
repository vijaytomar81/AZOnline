// src/tools/page-scanner/scanner/keyNaming/strategies.ts

import type { ScannedElement } from "../types";
import { normalizeBusinessPhrase, toKeyPreservingIdentifiers } from "./normalize";

function normalizeKeyPart(value?: string | null): string | undefined {
    const normalized = normalizeBusinessPhrase(value ?? undefined);
    const key = toKeyPreservingIdentifiers(normalized);
    return key || undefined;
}

function buildChoiceGroupBase(el: ScannedElement): string | undefined {
    return (
        normalizeKeyPart(el.inputName) ||
        normalizeKeyPart(el.ownerLabelText) ||
        normalizeKeyPart(el.ownerAriaLabel) ||
        normalizeKeyPart(el.ownerId) ||
        normalizeKeyPart(el.ownerGroupLabelFor)
    );
}

function buildChoiceOptionBase(el: ScannedElement): string | undefined {
    return (
        normalizeKeyPart(el.labelText) ||
        normalizeKeyPart(el.ariaLabel) ||
        normalizeKeyPart(el.text) ||
        normalizeKeyPart(el.name) ||
        normalizeKeyPart(el.id)
    );
}

function joinWithoutDup(left?: string, right?: string): string | undefined {
    if (!left && !right) return undefined;
    if (!left) return right;
    if (!right) return left;

    const leftLower = left.toLowerCase();
    const rightLower = right.toLowerCase();

    if (rightLower.startsWith(leftLower)) return right;
    if (leftLower.endsWith(rightLower)) return left;

    return `${left}${right}`;
}

export function buildRadioCheckboxKey(el: ScannedElement): string | undefined {
    const type = (el.typeAttr || "").toLowerCase();
    if (type !== "radio" && type !== "checkbox") return undefined;

    const groupBase = buildChoiceGroupBase(el);
    const optionBase = buildChoiceOptionBase(el);

    return joinWithoutDup(groupBase, optionBase);
}

export function buildFrameworkSearchKey(el: ScannedElement): string | undefined {
    if (!el.isFrameworkSearchInput) return undefined;

    return (
        normalizeKeyPart(el.ownerLabelText) ||
        normalizeKeyPart(el.ownerAriaLabel) ||
        normalizeKeyPart(el.ownerId) ||
        normalizeKeyPart(el.id) ||
        normalizeKeyPart(el.name)
    );
}

export function buildGenericKey(el: ScannedElement, indexHint: number): string {
    return (
        normalizeKeyPart(el.id) ||
        normalizeKeyPart(el.name) ||
        normalizeKeyPart(el.labelText) ||
        normalizeKeyPart(el.ariaLabel) ||
        normalizeKeyPart(el.placeholder) ||
        normalizeKeyPart(el.text) ||
        normalizeKeyPart(el.tag) ||
        `Element${indexHint}`
    );
}