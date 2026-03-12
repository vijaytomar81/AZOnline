// src/tools/page-scanner/scanner/getSmartElementsKey.ts

import type { ScannedElement } from "./types";
import {
    buildFrameworkSearchKey,
    buildGenericKey,
    buildRadioCheckboxKey,
} from "./keyNaming/strategies";
import { buildSemanticKey } from "./keyNaming/semantic";

/**
 * Map element type → key prefix
 */
function prefixForType(el: ScannedElement): string | null {
    const tag = (el.tag || "").toLowerCase();
    const role = (el.role || "").toLowerCase();
    const typeAttr = (el.typeAttr || "").toLowerCase();

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

/**
 * Capitalize first letter
 */
function capitalize(s: string): string {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Adds type prefix to semantic key
 */
function applyTypePrefix(el: ScannedElement, baseKey: string): string {
    const prefix = prefixForType(el);

    if (!prefix) return baseKey;

    // avoid duplicate prefixes like inputFirstName → inputInputFirstName
    if (baseKey.startsWith(prefix)) return baseKey;

    return `${prefix}${capitalize(baseKey)}`;
}

export function getSmartElementKey(
    el: ScannedElement,
    indexHint: number
): string {
    const radioOrCheckboxKey = buildRadioCheckboxKey(el);
    if (radioOrCheckboxKey) return applyTypePrefix(el, radioOrCheckboxKey);

    const frameworkSearchKey = buildFrameworkSearchKey(el);
    if (frameworkSearchKey) return applyTypePrefix(el, frameworkSearchKey);

    const semanticKey = buildSemanticKey(el);
    if (semanticKey) return applyTypePrefix(el, semanticKey);

    const genericKey = buildGenericKey(el, indexHint);
    return applyTypePrefix(el, genericKey);
}