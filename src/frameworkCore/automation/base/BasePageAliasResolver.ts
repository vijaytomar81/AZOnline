// src/frameworkCore/automation/base/BasePageAliasResolver.ts

import type { AliasMap, ElementDef } from "@frameworkCore/automation/engine";
import type { ElementsMap } from "./AutomationPageDriver";

export function getElementKeyFromAlias<A extends AliasMap>(
    aliases: A,
    aliasKey: keyof A
): string {
    const elementKey = aliases[String(aliasKey)];

    if (!elementKey) {
        throw new Error(`Alias "${String(aliasKey)}" not found in aliases map.`);
    }

    return elementKey;
}

export function getElementDefFromKey<E extends ElementsMap>(
    elements: E,
    elementKey: string
): ElementDef {
    const def = elements[elementKey];

    if (!def) {
        throw new Error(`ElementKey "${elementKey}" not found in elements map.`);
    }

    return def;
}