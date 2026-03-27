// src/data/builder/core/validation/runSchemaValidation.ts

import type ExcelJS from "exceljs";
import { getSchema } from "../../../data-definitions";
import { detectLayout } from "../spreadsheet";
import { validateTabularSchema } from "../validateTabularSchema";
import { validateVerticalSchema } from "../validateVerticalSchema";
import type { ValidationReport } from "../../types";

export function runSchemaValidation(args: {
    ws: ExcelJS.Worksheet;
    schemaName: string;
    sheetName: string;
    strict: boolean;
}): ValidationReport {
    const { ws, schemaName, sheetName, strict } = args;
    const schema = getSchema(schemaName, sheetName);

    if (schemaName === "pcw_tool") {
        return validateTabularSchema({
            ws,
            schema,
            schemaName,
            sheetName,
            strict,
        });
    }

    const layout = detectLayout(ws);

    return validateVerticalSchema({
        ws,
        schema,
        schemaName,
        sheetName,
        strict,
        fieldCol: layout.fieldCol,
        dataStartRow: layout.dataStartRow,
    });
}