// src/frameworkCore/executionLayer/mode/e2e/scenario/normalize/getTotalItems.ts

import { getString } from "./shared";

export function getTotalItems(value: unknown): number {
    const num = Number(getString(value));

    if (!Number.isInteger(num) || num < 0) {
        return 0;
    }

    return Math.min(num, 20);
}
