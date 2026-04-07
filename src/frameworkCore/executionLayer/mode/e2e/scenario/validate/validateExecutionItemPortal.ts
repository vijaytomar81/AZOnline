// src/executionLayer/mode/e2e/scenario/validate/validateExecutionItemPortal.ts

import type { ExecutionItem } from "@frameworkCore/executionLayer/contracts";
import { normalizeValidationKey } from "./shared";

export function validateExecutionItemPortal(
    item: ExecutionItem
): string[] {
    const portal = normalizeValidationKey(item.portal);

    if (!portal) {
        return [`Item${item.itemNo}: Missing Portal`];
    }

    if (portal !== "customerportal" && portal !== "supportportal") {
        return [
            `Item${item.itemNo}: Portal must be CustomerPortal or SupportPortal`,
        ];
    }

    return [];
}
