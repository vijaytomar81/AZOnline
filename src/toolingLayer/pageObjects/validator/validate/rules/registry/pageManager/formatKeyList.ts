// src/tools/pageObjects/validator/validate/rules/registry/pageManager/formatKeyList.ts

export function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}