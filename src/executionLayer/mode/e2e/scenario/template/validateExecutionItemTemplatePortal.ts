// src/executionLayer/mode/e2e/scenario/template/validateExecutionItemTemplatePortal.ts

import { normalizeTemplateKey } from "./shared";

export function validateExecutionItemTemplatePortal(
    itemNo: number,
    portal: string
): string[] {
    const normalized = normalizeTemplateKey(portal);

    if (!normalized) {
        return [`Item${itemNo}: Portal is required`];
    }

    if (normalized !== "customerportal" && normalized !== "supportportal") {
        return [`Item${itemNo}: Portal must be CustomerPortal or SupportPortal`];
    }

    return [];
}
