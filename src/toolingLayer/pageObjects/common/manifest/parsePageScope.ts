// src/toolingLayer/pageObjects/common/manifest/parsePageScope.ts

import { PAGE_OBJECT_KEY_CONFIG } from "@configLayer/tooling/pageObjects";
import { splitDotPath } from "@utils/text";
import type { PageScope } from "./types";

export type ParsePageScopeResult =
    | { ok: true; value: PageScope }
    | { ok: false; reason: string };

export function parsePageScope(pageKey: string): ParsePageScopeResult {
    const parts = splitDotPath(pageKey);
    const { minimumParts, indexes } = PAGE_OBJECT_KEY_CONFIG;

    if (parts.length < minimumParts) {
        return {
            ok: false,
            reason: `Invalid pageKey "${pageKey}" — expected format <platform>.<application>.<product>.<name>`,
        };
    }

    const platform = parts[indexes.platform] ?? "";
    const application = parts[indexes.application] ?? "";
    const product = parts[indexes.product] ?? "";
    const name = parts.slice(indexes.nameStart).join(".");

    if (!platform || !application || !product || !name) {
        return {
            ok: false,
            reason: `Missing required segments in pageKey "${pageKey}"`,
        };
    }

    return {
        ok: true,
        value: {
            platform,
            application,
            product,
            name,
            namespace: `${platform}.${application}.${product}`,
        },
    };
}
