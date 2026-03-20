// src/data/data-definitions/index.ts

import { uniq } from "../../utils/collections";
import { dataDefinitionRegistry } from "./registry";
import { resolveSchemaFromSheet } from "./sheet-name-schema.mapping";
import type { DataSchema, DataDefinitionGroup, RegisteredSchema } from "./types";

function normalizeSchemaName(name?: string): string {
    return String(name ?? "").trim().toLowerCase();
}

export function resolveSchemaName(name?: string, sheetName?: string): string {
    const explicit = normalizeSchemaName(name);
    if (explicit) return explicit;

    const mapped = resolveSchemaFromSheet(sheetName ?? "");
    if (mapped) return mapped;

    throw new Error(
        `Unable to resolve schema from sheet "${sheetName}". ` +
        `Pass --schema explicitly or add mapping in src/data/data-definitions/sheet-name-schema.mapping.ts`
    );
}

export function getSchemaDefinition(
    name?: string,
    sheetName?: string
): RegisteredSchema {
    const key = resolveSchemaName(name, sheetName);
    const definition = dataDefinitionRegistry[key];

    if (!definition) {
        throw new Error(
            `Unknown schema "${key}". Available schemas: ${listSchemas().join(", ")}`
        );
    }

    return definition;
}

export function getSchema(name?: string, sheetName?: string): DataSchema {
    return getSchemaDefinition(name, sheetName).schema;
}

export function getSchemaDataDefinitionGroup(
    name?: string,
    sheetName?: string
): DataDefinitionGroup {
    return getSchemaDefinition(name, sheetName).schema.dataDefinitionGroup;
}

export function listSchemas(): string[] {
    return uniq(Object.keys(dataDefinitionRegistry)).sort((a, b) =>
        a.localeCompare(b)
    );
}