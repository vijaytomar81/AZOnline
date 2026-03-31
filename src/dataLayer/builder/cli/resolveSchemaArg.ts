// src/dataLayer/builder/cli/resolveSchemaArg.ts

import { resolveSchemaName } from "../../data-definitions";
import { DataBuilderError } from "../errors";

export function resolveSchemaArg(args: {
    schemaArg: string;
    sheetName: string;
}): string {
    try {
        return resolveSchemaName(args.schemaArg, args.sheetName);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        throw new DataBuilderError({
            code: "SCHEMA_RESOLUTION_FAILED",
            stage: "schema-resolution",
            source: "resolveSchemaArg",
            message,
            context: {
                sheetName: args.sheetName,
                schemaArg: args.schemaArg,
            },
        });
    }
}