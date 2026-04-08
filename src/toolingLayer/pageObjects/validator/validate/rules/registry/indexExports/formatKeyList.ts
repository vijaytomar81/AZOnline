// src/toolingLayer/pageObjects/validator/validate/rules/registry/indexExports/formatKeyList.ts

export function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}
