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

export function getSchema(name?: string): DataSchema {
    const key = String(name ?? "master").trim().toLowerCase();
    const schema = schemas[key];
    if (!schema) {
        throw new Error(
            `Unknown schema "${name}". Available schemas: ${Object.keys(schemas).join(", ")}`
        );
    }
    return schema;
}

export function listSchemas(): string[] {
    return Object.keys(schemas);
}