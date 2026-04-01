// src/pageObjectTools/page-object-validator/validate/rules/hygiene/moduleHygiene/formatKeyList.ts

export function formatKeyList(keys: string[]): string {
    return `[${keys.join(", ")}]`;
}
