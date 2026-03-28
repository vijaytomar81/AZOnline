// src/execution/modes/e2e/scenario/template/validateTemplatePortal.ts

import { normalizeTemplateKey } from "./shared";

export function validateTemplatePortal(
    stepNo: number,
    portal: string
): string[] {
    const normalized = normalizeTemplateKey(portal);

    if (!normalized) {
        return [`Step${stepNo}: Portal is required`];
    }

    if (normalized !== "customerportal" && normalized !== "supportportal") {
        return [`Step${stepNo}: Portal must be CustomerPortal or SupportPortal`];
    }

    return [];
}
