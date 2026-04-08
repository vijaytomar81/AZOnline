// src/toolingLayer/pageObjects/validator/validate/rules/pageChain/pageObjectStructure/formatPageObjectStructureItems.ts

export function formatPageObjectStructureItems(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}
