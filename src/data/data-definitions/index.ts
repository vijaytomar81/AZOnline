// src/data/data-definitions/index.ts

import { uniq } from "@utils/collections";
import { normalizeSheetKey } from "@utils/text";
import { dataDefinitionRegistry } from "./registry";
import type { DataSchema, DataDefinitionGroup, RegisteredSchema } from "./types";
import { DataBuilderError } from "../builder/errors";

function normalizeSchemaName(name?: string): string {
    return String(name ?? "").trim().toLowerCase();
}

function buildSheetAliasMap(): Map<string, string> {
    const map = new Map<string, string>();

    Object.values(dataDefinitionRegistry).forEach((definition) => {
        const aliases = definition.sheetAliases ?? [];

        aliases.forEach((alias) => {
            const key = normalizeSheetKey(alias);
            if (!key) return;
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

function buildAvailableSheetMappingsText(): string {
    const availableSheetsList = listSheetAliases();

    const maxSheetLength = Math.max(
        ...availableSheetsList.map((item) => item.sheet.length),
        "Sheet Name (Excel)".length
    );

    const header =
        `  Sheet Name (Excel)` +
        `${" ".repeat(maxSheetLength - "Sheet Name (Excel)".length)}  -> Schema Name (System)`;

    const divider = `  ${"-".repeat(header.trim().length)}`;

    return [
        header,
        divider,
        "",
        ...availableSheetsList.map((item) => {
            const paddedSheet = item.sheet.padEnd(maxSheetLength, " ");
            return `  - ${paddedSheet}  -> ${item.schema}`;
        }),
    ].join("\n");
}

export function resolveSchemaName(name?: string, sheetName?: string): string {
    const explicit = normalizeSchemaName(name);
    if (explicit) return explicit;

    const aliasMap = buildSheetAliasMap();
    const normalizedSheet = normalizeSheetKey(sheetName ?? "");
    const mapped = aliasMap.get(normalizedSheet);

    if (mapped) return mapped;

    throw new DataBuilderError({
        code: "SCHEMA_NOT_AVAILABLE",
        stage: "schema-resolution",
        source: "data-definitions",
        message: [
            `Schema not available from sheet "${sheetName}".`,
            ``,
            `Available sheet → schema mappings:`,
            ``,
            buildAvailableSheetMappingsText(),
            ``,
            `Please rename the sheet accordingly.`,
        ].join("\n"),
        context: { sheetName },
    });
}

export function getSchemaDefinition(
    name?: string,
    sheetName?: string
): RegisteredSchema {
    const key = resolveSchemaName(name, sheetName);
    const definition = dataDefinitionRegistry[key];

    if (!definition) {
        throw new DataBuilderError({
            code: "UNKNOWN_SCHEMA",
            stage: "schema-resolution",
            source: "data-definitions",
            message: `Unknown schema "${key}". Available schemas: ${listSchemas().join(", ")}`,
            context: {
                schemaName: key,
                sheetName: sheetName ?? "",
            },
        });
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