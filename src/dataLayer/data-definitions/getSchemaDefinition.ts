// src/dataLayer/data-definitions/getSchemaDefinition.ts

import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type {
    DataDefinitionGroup,
    DataSchema,
    RegisteredSchema,
} from "./types";
import { DataBuilderError } from "../builder/errors";
import { dataDefinitionRegistry } from "./registry";
import { listSchemas } from "./listSchemas";
import { resolveSchemaName } from "./resolveSchemaName";

export function getSchemaDefinition(args: {
    schemaName?: string;
    journeyContext: JourneyContext;
    platform: Platform;
}): RegisteredSchema {
    const key = resolveSchemaName({
        schemaName: args.schemaName,
        journeyContext: args.journeyContext,
        platform: args.platform,
    });

    const definition = dataDefinitionRegistry[key];

    if (!definition) {
        throw new DataBuilderError({
            code: "UNKNOWN_SCHEMA",
            stage: "schema-resolution",
            source: "data-definitions/getSchemaDefinition",
            message: `Unknown schema "${key}". Available schemas: ${listSchemas().join(", ")}`,
            context: {
                schemaName: key,
                journeyContext: args.journeyContext,
                platform: args.platform,
            },
        });
    }

    return definition;
}

export function getSchema(args: {
    schemaName?: string;
    journeyContext: JourneyContext;
    platform: Platform;
}): DataSchema {
    return getSchemaDefinition(args).schema;
}

export function getSchemaDataDefinitionGroup(args: {
    schemaName?: string;
    journeyContext: JourneyContext;
    platform: Platform;
}): DataDefinitionGroup {
    return getSchemaDefinition(args).schema.dataDefinitionGroup;
}
