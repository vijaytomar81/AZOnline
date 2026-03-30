// src/executionLayer/logging/dataCase/formatRequestPreview.ts

export function formatRequestPreview(value: unknown): string {
    const text = String(value ?? "").trim();

    if (!text) {
        return "";
    }

    const maxLength = 100;

    return text.length > maxLength
        ? `${text.slice(0, maxLength)}...`
        : text;
}
