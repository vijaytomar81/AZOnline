// src/data/builder/core/validateVerticalSchema.ts

import type ExcelJS from "exceljs";
import type { DataSchema } from "../../data-definitions/types";
import { buildRowIndex, cellToString, norm, normKey } from "./excelRuntime";
import {
    addFields,
    buildSectionBuckets,
    buildValidationReport,
    collectSchemaFields,
    collectSchemaFieldsBySection,
    expandRepeatedGroupFields,
    missingFields,
} from "./schemaValidationShared";

function collectExcelFields(
    ws: ExcelJS.Worksheet,
    fieldCol: number,
    dataStartRow: number
) {
    const rows = buildRowIndex(ws, fieldCol, dataStartRow);
    const duplicates: string[] = [];
    const seen = new Set<string>();
    const maxRow = ws.rowCount || ws.actualRowCount || 0;

    for (let r = dataStartRow; r <= maxRow; r++) {
        const raw = norm(cellToString(ws.getCell(r, fieldCol).value));
        if (!raw) continue;

        const key = normKey(raw);
        if (seen.has(key)) duplicates.push(raw);
        seen.add(key);
    }

    return { rows, duplicates };
}

export function validateVerticalSchema(args: {
    ws: ExcelJS.Worksheet;
    schema: DataSchema;
    schemaName: string;
    sheetName: string;
    strict: boolean;
    fieldCol: number;
    dataStartRow: number;
}) {
    const { ws, schema, schemaName, sheetName, strict, fieldCol, dataStartRow } = args;
    const { rows, duplicates } = collectExcelFields(ws, fieldCol, dataStartRow);

    const schemaFields = new Set<string>();
    const sectionFields: Record<string, Set<string>> = {};

    for (const [section, value] of Object.entries(schema.groups)) {
        collectSchemaFields(value, schemaFields);
        collectSchemaFieldsBySection(value, sectionFields, section);
    }

    for (const [section, rep] of Object.entries(schema.repeatedGroups ?? {})) {
        let expanded: Set<string>;

        if (section === "additionalDriverClaims" || section === "additionalDriverConvictions") {
            expanded = new Set<string>();
            for (let driverIndex = 1; driverIndex <= 5; driverIndex++) {
                addFields(expanded, expandRepeatedGroupFields(rep, `AD${driverIndex}`));
            }
        } else {
            expanded = expandRepeatedGroupFields(rep);
        }

        sectionFields[section] ??= new Set<string>();
        addFields(sectionFields[section], expanded);
        addFields(schemaFields, expanded);
    }

    const requiredMissing = missingFields(rows, schema.requiredFields ?? []);
    const excelFields = new Set([...rows.keys()]);
    const schemaFieldKeys = new Set([...schemaFields].map(normKey));
    const unmappedExcel = [...excelFields].filter((field) => !schemaFieldKeys.has(field));

    const errors: string[] = [];
    requiredMissing.forEach((field) => errors.push(`Missing required field: ${field}`));

    if (strict) {
        duplicates.forEach((field) => errors.push(`Duplicate Excel field: ${field}`));
    }

    const bySection = buildSectionBuckets(rows, sectionFields, schema.requiredFields ?? []);

    return buildValidationReport({
        schemaName,
        sheetName,
        strict,
        errors,
        requiredMissing,
        bySection,
        unmappedExcel,
    });
}