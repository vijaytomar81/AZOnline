// src/dataLayer/data-definitions/listSheetAliases.ts

import { normalizeSheetKey } from "@utils/text";
import { dataDefinitionRegistry } from "./registry";

function buildSheetAliasMap(): Map<string, string> {
    const map = new Map<string, string>();

    Object.values(dataDefinitionRegistry).forEach((definition) => {
        const aliases = definition.sheetAliases ?? [];

        aliases.forEach((alias) => {
            const key = normalizeSheetKey(alias);
            if (!key) {
                return;
            }

            map.set(key, definition.name);
        });
    });

    return map;
}

export function listSheetAliases(): Array<{ sheet: string; schema: string }> {
    return Object.values(dataDefinitionRegistry)
        .flatMap((definition) =>
            (definition.sheetAliases ?? []).map((alias) => ({
                sheet: alias,
                schema: definition.name,
            }))
        )
        .sort((a, b) => a.sheet.localeCompare(b.sheet));
}

export function findSchemaNameBySheetAlias(
    sheetName?: string
): string | undefined {
    const aliasMap = buildSheetAliasMap();
    const normalizedSheet = normalizeSheetKey(sheetName ?? "");
    return aliasMap.get(normalizedSheet);
}