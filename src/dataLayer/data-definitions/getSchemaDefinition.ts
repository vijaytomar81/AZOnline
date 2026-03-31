// src/dataLayer/data-definitions/getSchemaDefinition.ts

import type {
    DataDefinitionGroup,
    DataSchema,
    RegisteredSchema,
} from "./types";
import { DataBuilderError } from "../builder/errors";
import { dataDefinitionRegistry } from "./registry";
import { listSchemas } from "./listSchemas";
import { resolveSchemaName } from "./resolveSchemaName";

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