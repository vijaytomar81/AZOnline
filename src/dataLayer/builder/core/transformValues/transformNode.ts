// src/dataLayer/builder/core/transformValues/transformNode.ts

import { toNumberIfPossible } from "./toNumberIfPossible";

function shouldConvertToNumber(key: string): boolean {
    return key === "count" || key.endsWith("Count");
}

export function transformNode(node: unknown, parentKey = ""): unknown {
    if (Array.isArray(node)) {
        return node.map((item) => transformNode(item));
    }

    if (!node || typeof node !== "object") {
        if (typeof node === "string") {
            return shouldConvertToNumber(parentKey)
                ? toNumberIfPossible(node)
                : node.trim();
        }

        return node;
    }

    const out: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(node)) {
        if (typeof value === "string") {
            out[key] = shouldConvertToNumber(key)
                ? toNumberIfPossible(value)
                : value.trim();
            continue;
        }

        out[key] = transformNode(value, key);
    }

    return out;
}