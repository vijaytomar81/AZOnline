// src/tools/pageScanner/scanner/keyNaming/normalize.ts

export function clean(value?: string | null): string | undefined {
    const v = value?.replace(/\s+/g, " ").trim();
    return v ? v : undefined;
}

export function isReactSelectInput(id?: string | null): boolean {
    return !!id && /^react-select-\d+-input$/i.test(id);
}

export function isWeakValue(value?: string | null): boolean {
    const v = clean(value);
    if (!v) return true;

    if (/^\d+$/.test(v)) return true;
    if (/^[^a-zA-Z0-9]+$/.test(v)) return true;
    if (/^react-select-\d+-input$/i.test(v)) return true;
    if (/^(root|app|main|container|wrapper|content|page|section|panel)$/i.test(v)) {
        return true;
    }

    return false;
}

function isAllCapsToken(value: string): boolean {
    return /^[A-Z0-9]+$/.test(value) && /[A-Z]/.test(value);
}

function isCamelOrPascalToken(value: string): boolean {
    return /^[A-Za-z][A-Za-z0-9]*$/.test(value);
}

function normalizeAcronymToken(part: string, idx: number): string {
    if (idx === 0) {
        return part.toLowerCase();
    }
    return part;
}

function normalizeWordToken(part: string, idx: number): string {
    const lower = part.toLowerCase();

    if (idx === 0) {
        return lower.charAt(0).toLowerCase() + lower.slice(1);
    }

    return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function normalizeIdentifierToken(part: string, idx: number): string {
    if (isAllCapsToken(part)) {
        return normalizeAcronymToken(part, idx);
    }

    if (isCamelOrPascalToken(part)) {
        if (idx === 0) {
            return part.charAt(0).toLowerCase() + part.slice(1);
        }
        return part.charAt(0).toUpperCase() + part.slice(1);
    }

    return normalizeWordToken(part, idx);
}

export function toKeyPreservingIdentifiers(value?: string | null): string | undefined {
    const v = clean(value);
    if (!v) return undefined;

    if (/^[A-Za-z][A-Za-z0-9]*$/.test(v)) {
        return v.charAt(0).toLowerCase() + v.slice(1);
    }

    const parts = v
        .replace(/^[^A-Za-z0-9]+/, "")
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean);

    if (!parts.length) return undefined;

    return parts.map((part, idx) => normalizeIdentifierToken(part, idx)).join("");
}

export function upperFirst(value?: string): string | undefined {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function normalizeBusinessPhrase(value?: string | null): string | undefined {
    const v = clean(value);
    if (!v) return undefined;

    return v
        .replace(/\bT\s*&\s*C(?:'s|s)?\b/gi, "Terms And Conditions")
        .replace(/\bT&Cs\b/gi, "Terms And Conditions")
        .replace(/\bT&C\b/gi, "Terms And Conditions")
        .replace(/\bFAQs\b/gi, "Frequently Asked Questions");
}