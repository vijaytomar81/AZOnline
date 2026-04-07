// src/tools/pageActions/generator/core/action/classifyPageObjectMethods.ts

import type { ClassifiedMethods, ExtractedMethod } from "../../shared/types";
import { normalizeFieldNameFromMethod } from "../../shared/naming";

function isValueMethod(method: ExtractedMethod): boolean {
    return method.hasArguments && /^(input|select|search)/.test(method.name);
}

function isSuggestionMethod(method: ExtractedMethod): boolean {
    return /^(button|link|radio|groupRadio)/.test(method.name);
}

function hasNumericToken(value: string): boolean {
    return /\d+/.test(value);
}

function inferRepeatedFamilyFromValueField(fieldName: string): string | null {
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

function inferRepeatedFamilyFromControlName(methodName: string): string | null {
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

function isLowConfidenceValueMethod(method: ExtractedMethod): boolean {
    const name = method.name.toLowerCase();

    return (
        name.startsWith("search") ||
        name.includes("addresslookup")
    );
}

export function classifyPageObjectMethods(
    methods: ExtractedMethod[]
): ClassifiedMethods {
    const valueMethods = methods.filter(isValueMethod);
    const allSuggestionMethods = methods.filter(isSuggestionMethod);

    const repeatedFamilies = new Set(
        valueMethods
            .map((method) => normalizeFieldNameFromMethod(method.name))
            .filter((fieldName) => hasNumericToken(fieldName))
            .map((fieldName) => inferRepeatedFamilyFromValueField(fieldName))
            .filter((family): family is string => Boolean(family))
    );

    const activeValueMethods: ExtractedMethod[] = [];
    const conditionalIndexedValueMethods: ExtractedMethod[] = [];
    const conditionalIndexedControlMethods: ExtractedMethod[] = [];
    const todoValueMethods: ExtractedMethod[] = [];
    const suggestionMethods: ExtractedMethod[] = [];

    valueMethods.forEach((method) => {
        const fieldName = normalizeFieldNameFromMethod(method.name);
        const family = inferRepeatedFamilyFromValueField(fieldName);

        if (family && repeatedFamilies.has(family)) {
            conditionalIndexedValueMethods.push(method);
            return;
        }

        if (isLowConfidenceValueMethod(method)) {
            todoValueMethods.push(method);
            return;
        }

        activeValueMethods.push(method);
    });

    allSuggestionMethods.forEach((method) => {
        const family = inferRepeatedFamilyFromControlName(method.name);
        const lower = method.name.toLowerCase();

        if (
            family &&
            repeatedFamilies.has(family) &&
            lower.includes("addanother")
        ) {
            conditionalIndexedControlMethods.push(method);
            return;
        }

        suggestionMethods.push(method);
    });

    return {
        activeValueMethods,
        conditionalIndexedValueMethods,
        conditionalIndexedControlMethods,
        todoValueMethods,
        suggestionMethods,
    };
}
