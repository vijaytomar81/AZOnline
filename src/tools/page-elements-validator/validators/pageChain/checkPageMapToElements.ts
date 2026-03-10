// src/tools/page-elements-validator/validators/pageChain/checkPageMapToElements.ts

import { extractTopLevelObjectKeys } from "../shared/extractTsObjectKeys";
import { buildStep } from "./types";

export function checkPageMapToElements(params: {
    pageMapKeys: string[];
    elementsTs: string;
}) {

    const errors: string[] = [];
    const warnings: string[] = [];

    const elementsKeys = extractTopLevelObjectKeys(params.elementsTs, "elements");

    if (!elementsKeys.length) {
        errors.push("elements.ts: unable to extract elements keys");
    }

    const mapSet = new Set(params.pageMapKeys);
    const elSet = new Set(elementsKeys);

    const missing = params.pageMapKeys.filter(k => !elSet.has(k));
    const extra = elementsKeys.filter(k => !mapSet.has(k));

    if (missing.length) {
        errors.push(`elements.ts missing keys: ${missing.join(", ")}`);
    }

    if (extra.length) {
        warnings.push(`elements.ts extra keys: ${extra.join(", ")}`);
    }

    return {
        elementsKeys,
        step: buildStep(
            "Page Map → Elements",
            errors,
            warnings,
            "elements.ts matches page-map"
        )
    };
}