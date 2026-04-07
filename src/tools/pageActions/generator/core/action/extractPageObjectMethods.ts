// src/tools/pageActions/generator/core/action/extractPageObjectMethods.ts

import type { ExtractedMethod } from "../../shared/types";

const IGNORE_METHODS = new Set([
    "waitUntilReady",
    "assertOnPage",
    "clickAliasKey",
    "fillAliasKey",
    "selectAliasKey",
    "setCheckedAliasKey",
]);

export function extractPageObjectMethods(source: string): ExtractedMethod[] {
    const regex = /async\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*\{/g;
    const methods: ExtractedMethod[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(source))) {
        const name = match[1];
        const params = match[2].trim();

        if (IGNORE_METHODS.has(name)) {
            continue;
        }

        methods.push({
            name,
            hasArguments: params.length > 0,
        });
    }

    return methods;
}
