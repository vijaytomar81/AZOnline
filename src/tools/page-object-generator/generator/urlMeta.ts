// src/tools/page-object-generator/generator/urlMeta.ts

import { escapeForRegex } from "@/utils/regex";

/**
 * Create a stable URL regex from urlPath by replacing the last segment with a dynamic matcher.
 *
 * Example:
 *  /journey/show/product/.../numberPlateScan/69a409b5d35138197f847674
 * becomes:
 *  /\/journey\/show\/product\/...\/numberPlateScan\/[a-z0-9]+/i
 *
 * If last segment contains unexpected chars, we fall back to ([^/]+)
 */
export function buildUrlReFromUrlPath(urlPath: string): string {
    const trimmed = (urlPath ?? "").trim();
    if (!trimmed.startsWith("/")) return "";

    const parts = trimmed.split("/").filter(Boolean);
    if (parts.length === 0) return "";

    const last = parts[parts.length - 1] ?? "";

    // If the last segment looks like a hex-ish/random id, prefer [a-z0-9]+
    const dynamic =
        /^[a-z0-9]+$/i.test(last) && /[a-z]/i.test(last) ? "[a-z0-9]+" : "([^/]+)";

    const prefixParts = parts.slice(0, -1).map(escapeForRegex);
    const prefix = prefixParts.length ? `/${prefixParts.join("/")}` : "";
    const source = `${prefix}/${dynamic}`;

    // return TS regex literal string (without surrounding quotes)
    return `/${source.replace(/\//g, "\\/")}/i`;
}