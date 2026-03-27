// src/data/data-definitions/resolveSchemaName.ts

import { DataBuilderError } from "../builder/errors";
import { buildAvailableSheetMappingsText } from "./buildAvailableSheetMappingsText";
import { findSchemaNameBySheetAlias } from "./listSheetAliases";

function normalizeSchemaName(name?: string): string {
    return String(name ?? "").trim().toLowerCase();
}

export function resolveSchemaName(name?: string, sheetName?: string): string {
    const explicit = normalizeSchemaName(name);
    if (explicit) {
        return explicit;
    }

    const mapped = findSchemaNameBySheetAlias(sheetName);
    if (mapped) {
        return mapped;
    }

    throw new DataBuilderError({
        code: "SCHEMA_NOT_AVAILABLE",
        stage: "schema-resolution",
        source: "data-definitions",
        message: [
            `Schema not available from sheet "${sheetName}".`,
            "",
            "Available sheet → schema mappings:",
            "",
            buildAvailableSheetMappingsText(),
            "",
            "Please rename the sheet accordingly.",
        ].join("\n"),
        context: { sheetName },
    });
}