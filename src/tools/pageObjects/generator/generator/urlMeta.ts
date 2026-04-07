// src/tools/pageObjects/generator/generator/urlMeta.ts

import { escapeForRegex } from "@utils/regex";

/**
 * Create a stable URL regex from urlPath.
 *
 * Examples:
 *  /                        -> /^\/$/i
 *  /products                -> /^\/products$/i
 *  /journey/.../abc123      -> /\/journey\/...\/[a-z0-9]+/i
 *
 * If the last segment looks dynamic, replace it with a matcher.
 * Otherwise build an exact path regex.
 */
export function buildUrlReFromUrlPath(urlPath: string): string {
    const trimmed = (urlPath ?? "").trim();
    if (!trimmed.startsWith("/")) return "";

    if (trimmed === "/") {
        return `/^\\/$/i`;
    }

    const parts = trimmed.split("/").filter(Boolean);
    if (parts.length === 0) {
        return `/^\\/$/i`;
    }

    const last = parts[parts.length - 1] ?? "";
    const looksDynamic =
        /^[a-z0-9]+$/i.test(last) &&
        /[a-z]/i.test(last) &&
        parts.length > 1;

    if (!looksDynamic) {
        return `/^${escapeForRegex(trimmed).replace(/\//g, "\\/")}$/i`;
    }

    const prefixParts = parts.slice(0, -1).map(escapeForRegex);
    const prefix = prefixParts.length ? `/${prefixParts.join("/")}` : "";
    const source = `${prefix}/[a-z0-9]+`;

    return `/${source.replace(/\//g, "\\/")}/i`;
}