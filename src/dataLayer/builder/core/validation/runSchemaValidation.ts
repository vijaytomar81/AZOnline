// src/dataLayer/builder/core/validation/runSchemaValidation.ts

import type { Worksheet } from "exceljs";
import { getSchema } from "../../../data-definitions";
import type { ValidationReport } from "../../types";
import type { SheetLayout } from "../spreadsheet/detectLayout";
import { validateVerticalSchema } from "../validateVerticalSchema";

export function runSchemaValidation(args: {
    schemaName?: string;
    sheetName: string;
    platform: import("@configLayer/models/platform.config").Platform;
    journeyContext: import("@configLayer/models/journeyContext.config").JourneyContext;
    layout: SheetLayout;
    ws: Worksheet;
    strict: boolean;
}): ValidationReport {
    const schema = getSchema({
        schemaName: args.schemaName,
        journeyContext: args.journeyContext,
        platform: args.platform,
    });

    return validateVerticalSchema({
        ws: args.ws,
        schema,
        schemaName: args.schemaName ?? "",
        sheetName: args.sheetName,
        strict: args.strict,
        fieldCol: args.layout.fieldCol,
        dataStartRow: args.layout.dataStartRow,
    });
}