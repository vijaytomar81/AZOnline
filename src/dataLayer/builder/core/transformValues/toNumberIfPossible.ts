// src/dataLayer/builder/core/transformValues/toNumberIfPossible.ts

export function toNumberIfPossible(value: string): string | number {
    const trimmed = value.trim();

    if (trimmed === "") {
        return "";
    }

    if (!/^-?\d+$/.test(trimmed)) {
        return trimmed;
    }

    const parsed = Number(trimmed);
    return Number.isSafeInteger(parsed) ? parsed : trimmed;
}