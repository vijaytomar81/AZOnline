import type { ScannedElement } from "./types";
import { buildFrameworkSearchKey, buildGenericKey, buildRadioCheckboxKey } from "./keyNaming/strategies";
import { buildSemanticKey } from "./keyNaming/semantic";

export function getSmartElementKey(el: ScannedElement, indexHint: number): string {
    const radioOrCheckboxKey = buildRadioCheckboxKey(el);
    if (radioOrCheckboxKey) return radioOrCheckboxKey;

    const frameworkSearchKey = buildFrameworkSearchKey(el);
    if (frameworkSearchKey) return frameworkSearchKey;

    const semanticKey = buildSemanticKey(el);
    if (semanticKey) return semanticKey;

    return buildGenericKey(el, indexHint);
}