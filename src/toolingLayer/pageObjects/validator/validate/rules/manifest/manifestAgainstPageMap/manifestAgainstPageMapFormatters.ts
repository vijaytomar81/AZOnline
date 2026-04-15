// src/toolingLayer/pageObjects/validator/validate/rules/manifest/manifestAgainstPageMap/manifestAgainstPageMapFormatters.ts

import path from "node:path";

export function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

export function formatMismatchList(items: string[]): string {
    return `[${items.join(", ")}]`;
}

export function manifestFileName(manifestFile: string): string {
    return path.basename(manifestFile);
}

function normalizeValue(value: unknown): string {
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    return typeof value === "string" ? value : JSON.stringify(value);
}

export function mismatchText(
    field: string,
    actualValue: unknown,
    expectedValue: unknown
): string {
    return `${field} → actual: ${normalizeValue(actualValue)}, expected: ${normalizeValue(expectedValue)}`;
}
