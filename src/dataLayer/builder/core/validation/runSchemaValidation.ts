// src/dataLayer/builder/core/validation/runSchemaValidation.ts

import type { Worksheet } from "exceljs";
import { getSchema } from "../../../data-definitions";
import type { ValidationReport } from "../../types";
import { validateTabularSchema } from "../validateTabularSchema";
import { validateVerticalSchema } from "../validateVerticalSchema";

export function runSchemaValidation(args: {
    schemaName?: string;
    sheetName: string;
    platform: import("@configLayer/models/platform.config").Platform;
    product: import("@configLayer/models/product.config").Product;
    journeyContext: import("@configLayer/models/journeyContext.config").JourneyContext;
    meta: any;
    ws: Worksheet;
    strict: boolean;
}): ValidationReport {
    const schema = getSchema({
        schemaName: args.schemaName,
        journeyContext: args.journeyContext,
        platform: args.platform,
        product: args.product,
    });

    if (args.meta.layout === "tabular") {
        return validateTabularSchema({
            ws: args.ws,
            schema,
            schemaName: args.schemaName ?? "",
            sheetName: args.sheetName,
            strict: args.strict,
        });
    }

    return validateVerticalSchema({
        ws: args.ws,
        schema,
        schemaName: args.schemaName ?? "",
        sheetName: args.sheetName,
        strict: args.strict,
        fieldCol: args.meta.fieldCol,
        dataStartRow: args.meta.dataStartRow,
    });
}
