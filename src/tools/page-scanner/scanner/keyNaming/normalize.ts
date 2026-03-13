// src/tools/page-scanner/scanner/keyNaming/normalize.ts

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

function normalizeToken(part: string, idx: number): string {
    if (!part) return part;

    // Preserve fully-capitalized acronyms like UK, EU, FAQ, ID
    if (isAllCapsToken(part)) {
        return idx === 0 ? part.charAt(0).toLowerCase() + part.slice(1) : part;
    }

    // Preserve already camel/pascal identifier-like tokens
    if (/^[A-Za-z][A-Za-z0-9]*$/.test(part)) {
        if (idx === 0) {
            return part.charAt(0).toLowerCase() + part.slice(1);
        }
        return part.charAt(0).toUpperCase() + part.slice(1);
    }

    return idx === 0
        ? part.charAt(0).toLowerCase() + part.slice(1).toLowerCase()
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
}

export function toKeyPreservingIdentifiers(value?: string | null): string | undefined {
    const v = clean(value);
    if (!v) return undefined;

    if (/^[A-Za-z][A-Za-z0-9]*$/.test(v)) {
        return v;
    }

    const parts = v
        .replace(/^[^A-Za-z0-9]+/, "")
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean);

    if (!parts.length) return undefined;

    return parts.map((part, idx) => normalizeToken(part, idx)).join("");
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