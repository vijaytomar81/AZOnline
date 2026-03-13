// src/tools/page-scanner/scanner/getSmartElementsKey.ts

import type { ScannedElement } from "./types";
import {
    buildFrameworkSearchKey,
    buildGenericKey,
    buildRadioCheckboxKey,
} from "./keyNaming/strategies";
import { buildSemanticKey } from "./keyNaming/semantic";

function prefixForType(el: ScannedElement): string | null {
    const tag = (el.tag || "").toLowerCase();
    const role = (el.role || "").toLowerCase();
    const typeAttr = (el.typeAttr || "").toLowerCase();

    if (el.isFrameworkSearchInput) return "searchSelect";

    if (tag === "select" || role === "combobox") return "select";
    if (tag === "textarea") return "textarea";

    if (tag === "input") {
        if (typeAttr === "radio") return "radio";
        if (typeAttr === "checkbox") return "checkbox";
        return "input";
    }

    if (tag === "button" || role === "button") return "button";
    if (tag === "a" || role === "link") return "link";

    if (role === "alert") return "alert";
    if (role === "dialog") return "dialog";

    if (tag === "div" && el.text) return "message";

    return null;
}

function capitalize(s: string): string {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function applyTypePrefix(el: ScannedElement, baseKey: string): string {
    const prefix = prefixForType(el);
    if (!prefix) return baseKey;

    return `${prefix}${capitalize(baseKey)}`;
}

export function getSmartElementKey(
    el: ScannedElement,
    indexHint: number
): string {
    const radioOrCheckboxBase = buildRadioCheckboxKey(el);
    if (radioOrCheckboxBase) return applyTypePrefix(el, radioOrCheckboxBase);

    const frameworkSearchBase = buildFrameworkSearchKey(el);
    if (frameworkSearchBase) return applyTypePrefix(el, frameworkSearchBase);

    const semanticBase = buildSemanticKey(el);
    if (semanticBase) return applyTypePrefix(el, semanticBase);

    const genericBase = buildGenericKey(el, indexHint);
    return applyTypePrefix(el, genericBase);
}