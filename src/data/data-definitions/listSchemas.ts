// src/data/data-definitions/listSchemas.ts

import { uniq } from "@utils/collections";
import { dataDefinitionRegistry } from "./registry";

export function listSchemas(): string[] {
    return uniq(Object.keys(dataDefinitionRegistry)).sort((a, b) =>
        a.localeCompare(b)
    );
}