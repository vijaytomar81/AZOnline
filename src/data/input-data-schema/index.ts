// src/data/input-data-schema/index.ts

import type { DataSchema } from "./types";
import { masterJourneySchema } from "./master-journey.schema";

const schemas: Record<string, DataSchema> = {
    master: masterJourneySchema,
    direct: masterJourneySchema,
    cnf: masterJourneySchema,
    ctm: masterJourneySchema,
    goco: masterJourneySchema,
    msm: masterJourneySchema,
};

const sheetToSchema: Record<string, string> = {
    master_template: "master",
    master: "master",

    direct: "direct",
    flownb: "direct",
    ferrynb: "direct",
    ferrydriveawayplusannual: "direct",
    ferrydriveawayannualnb: "direct",
    ferrydriveawayonlynb: "direct",
    agentportal_driveawayplusannual: "direct",
    agentportal_driveawayonly: "direct",
    agentportal_annual: "direct",
    motor_multipolicy: "direct",

    cnf: "cnf",
    ctm: "ctm",
    goco: "goco",
    msm: "msm",
};

function normKey(value: string): string {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[^\w]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

export function resolveSchemaName(name?: string, sheetName?: string): string {
    const explicit = String(name ?? "").trim().toLowerCase();
    if (explicit) return explicit;

    const normalizedSheet = normKey(sheetName ?? "");
    const mapped = sheetToSchema[normalizedSheet];
    if (mapped) return mapped;

    throw new Error(
        `Unable to resolve schema from sheet "${sheetName}". ` +
        `Pass --schema explicitly or add sheet mapping in input-data-schema/index.ts`
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

export function listSheetSchemaMappings(): Array<{ sheet: string; schema: string }> {
    return Object.entries(sheetToSchema).map(([sheet, schema]) => ({ sheet, schema }));
}