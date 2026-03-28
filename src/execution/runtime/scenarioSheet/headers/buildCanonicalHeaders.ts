// src/execution/runtime/scenarioSheet/headers/buildCanonicalHeaders.ts

import { normalizeHeaderKey } from "@utils/text";
import { defaultE2EPipelineTemplateConfig } from "@execution/modes/e2e/scenario/e2EPipelineTemplateConfig";

function normalizeHeader(value: unknown): string {
    return normalizeHeaderKey(value);
}

export function buildCanonicalHeaders(): Map<string, string> {
    const cfg = defaultE2EPipelineTemplateConfig;
    const map = new Map<string, string>();

    const baseHeaders = [
        ...cfg.requiredBaseHeaders,
        ...cfg.conditionalBaseHeaders.existingPolicy,
        ...cfg.conditionalBaseHeaders.newBusiness,
    ];

    baseHeaders.forEach((header) => map.set(normalizeHeader(header), header));

    for (let stepNo = 1; stepNo <= cfg.maxSteps; stepNo++) {
        cfg.stepFieldSuffixes.forEach((suffix) => {
            const header = `Step${stepNo}${suffix}`;
            map.set(normalizeHeader(header), header);
        });
    }

    return map;
}
