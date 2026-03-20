// src/data/schemas/index.ts

import type { DataSchema } from "./types";
import { masterJourneySchema } from "./master-journey.schema";
import { resolveSchemaFromSheet } from "./sheet-schema.mapping";

const schemas: Record<string, DataSchema> = {
    master: masterJourneySchema,
    direct: masterJourneySchema,
    cnf: masterJourneySchema,
    ctm: masterJourneySchema,
    goco: masterJourneySchema,
    msm: masterJourneySchema,
};

export function resolveSchemaName(name?: string, sheetName?: string): string {
    const explicit = String(name ?? "").trim().toLowerCase();
    if (explicit) return explicit;

    const mapped = resolveSchemaFromSheet(sheetName ?? "");
    if (mapped) return mapped;

    throw new Error(
        `Unable to resolve schema from sheet "${sheetName}". ` +
        `Pass --schema explicitly or add mapping in src/data/schemas/sheet-schema.mapping.ts`
    );
}

export function getSchema(name?: string, sheetName?: string): DataSchema {
    const key = resolveSchemaName(name, sheetName);
    const schema = schemas[key];

    if (!schema) {
        throw new Error(
            `Unknown schema "${key}". Available schemas: ${Object.keys(schemas).join(", ")}`
        );
    }

    return schema;
}

export function listSchemas(): string[] {
    return Object.keys(schemas);
}