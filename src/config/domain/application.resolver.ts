// src/config/domain/application.resolver.ts

import { normalizeSpaces } from "@utils/text";
import type { Application } from "./routing.config";
import {
    APPLICATION_RAW_VALUE_MAP,
    APPLICATION_SOURCE_RULES,
} from "./application.inference.config";

function normalizeKey(value?: string): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

function matchesTokenRule(value: string, tokens: string[]): boolean {
    return tokens.some((token) => value.includes(normalizeKey(token)));
}

export function resolveApplicationFromRaw(
    raw?: string
): Application | undefined {
    const value = normalizeKey(raw);

    if (!value) {
        return undefined;
    }

    return APPLICATION_RAW_VALUE_MAP[value];
}

export function inferApplicationFromSource(
    source?: string
): Application | undefined {
    const value = normalizeKey(source);

    if (!value) {
        return undefined;
    }

    const match = APPLICATION_SOURCE_RULES.find((rule) =>
        matchesTokenRule(value, rule.tokens)
    );

    return match?.application;
}
