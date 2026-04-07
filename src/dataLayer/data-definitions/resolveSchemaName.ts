// src/dataLayer/data-definitions/resolveSchemaName.ts

import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import { DataBuilderError } from "../builder/errors";
import { resolveSchemaSelection } from "./schemaSelection.config";

function normalizeSchemaName(name?: string): string {
    return String(name ?? "").trim().toLowerCase();
}

export function resolveSchemaName(args: {
    schemaName?: string;
    journeyContext: JourneyContext;
    platform: Platform;
}): string {
    const explicit = normalizeSchemaName(args.schemaName);
    if (explicit) {
        return explicit;
    }

    const resolved = resolveSchemaSelection({
        journeyContext: args.journeyContext,
        platform: args.platform,
    });

    if (resolved) {
        return resolved;
    }

    throw new DataBuilderError({
        code: "SCHEMA_NOT_AVAILABLE",
        stage: "schema-resolution",
        source: "data-definitions/resolveSchemaName",
        message: `No schema available for journeyContext="${args.journeyContext.type}" and platform="${args.platform}".`,
        context: {
            journeyContext: args.journeyContext,
            platform: args.platform,
        },
    });
}