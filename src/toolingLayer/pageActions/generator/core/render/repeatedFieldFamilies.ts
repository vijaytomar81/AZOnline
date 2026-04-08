// src/toolingLayer/pageActions/generator/core/render/repeatedFieldFamilies.ts

export function hasNumericToken(value: string): boolean {
    return /\d+/.test(value);
}

export function inferRepeatedFamilyFromValueField(
    fieldName: string
): string | null {
    const lower = fieldName.toLowerCase();

    if (lower.includes("additionaldriver")) {
        return "additionalDriver";
    }

    if (lower.includes("conviction")) {
        return "conviction";
    }

    if (lower.includes("claim")) {
        return "claim";
    }

    const match = fieldName.match(/^([a-z]+(?:[A-Z][a-z]+)*?)(\d+)/);

    return match ? match[1] : null;
}

export function inferRepeatedFamilyFromControlName(
    methodName: string
): string | null {
    const lower = methodName.toLowerCase();

    if (lower.includes("additionaldriver")) {
        return "additionalDriver";
    }

    if (lower.includes("conviction")) {
        return "conviction";
    }

    if (lower.includes("claim")) {
        return "claim";
    }

    const match = methodName.match(/^([A-Za-z]+?)(\d+)/);

    return match ? match[1] : null;
}
