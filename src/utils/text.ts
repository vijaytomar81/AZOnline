// src/utils/text.ts

export function stripLineComments(ts: string): string {
    return ts.replace(/\/\/.*$/gm, "");
}

export function fileLooksLikeModule(tsText: string): boolean {
    return /\bexport\b|\bimport\b/.test(tsText);
}

export function normWhitespace(s: string): string {
    return s.trim().replace(/\s+/g, " ");
}

export function toCamelFromText(s: string): string {
    const cleaned = s
        .trim()
        .toLowerCase()
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

    if (!cleaned) return "";

    const parts = cleaned.split(/\s+/g);

    return parts
        .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
        .join("");
}

export function normalizeSpaces(s: string): string {
    return String(s ?? "").trim().replace(/\s+/g, " ");
}

export function escapeNewlines(s: string): string {
    return String(s ?? "").replace(/\r?\n/g, " ");
}

export function normalizeLookupKey(value: unknown): string {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/[\s_-]+/g, "")
        .replace(/[^\w]/g, "");
}

export function normalizeHeaderKey(value: unknown): string {
    return normalizeLookupKey(value);
}

export function normalizeSheetKey(value: unknown): string {
    return normalizeLookupKey(value);
}

export function toKebabFromSnake(value: unknown): string {
    return String(value ?? "")
        .trim()
        .replace(/_/g, "-");
}