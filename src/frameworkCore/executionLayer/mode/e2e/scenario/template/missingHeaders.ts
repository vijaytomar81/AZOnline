// src/frameworkCore/executionLayer/mode/e2e/scenario/template/missingHeaders.ts

import { normalizeTemplateKey } from "./shared";

export function missingHeaders(
    actualHeaders: string[],
    expectedHeaders: string[]
): string[] {
    const actual = new Set(actualHeaders.map(normalizeTemplateKey));

    return expectedHeaders.filter(
        (header) => !actual.has(normalizeTemplateKey(header))
    );
}
