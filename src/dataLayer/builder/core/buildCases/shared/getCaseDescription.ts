// src/dataLayer/builder/core/buildCases/shared/getCaseDescription.ts

export function getCaseDescription(
    data: Record<string, any>
): string | undefined {
    return String(data.meta?.description ?? "").trim() || undefined;
}