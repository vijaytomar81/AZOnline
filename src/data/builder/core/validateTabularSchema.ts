// src/data/builder/core/validateTabularSchema.ts

import type ExcelJS from "exceljs";
import { normalizeHeaderKey, normalizeSpaces } from "@utils/text";
import type { DataSchema } from "../../data-definitions/types";
import {
    buildSectionBuckets,
    buildValidationReport,
    collectSchemaFields,
    collectSchemaFieldsBySection,
    missingFields,
} from "./schemaValidationShared";

function getHeaders(ws: ExcelJS.Worksheet): string[] {
    const maxCol = ws.columnCount || ws.actualColumnCount || 0;

    return Array.from({ length: maxCol }, (_, idx) =>
        normalizeSpaces(String(ws.getCell(1, idx + 1).value ?? ""))
    ).filter(Boolean);
}

function buildHeaderRows(headers: string[]) {
    const rows = new Map<string, number>();
    const duplicates: string[] = [];
    const seen = new Set<string>();

    headers.forEach((header) => {
        const key = normalizeHeaderKey(header);
        if (seen.has(key)) duplicates.push(header);
        seen.add(key);
        rows.set(key, 1);
    });

    return { rows, duplicates };
}

export function validateTabularSchema(args: {
    ws: ExcelJS.Worksheet;
    schema: DataSchema;
    schemaName: string;
    sheetName: string;
    strict: boolean;
}) {
    const { ws, schema, schemaName, sheetName, strict } = args;
    const headers = getHeaders(ws);
    const { rows, duplicates } = buildHeaderRows(headers);

    const schemaFields = new Set<string>();
    const sectionFields: Record<string, Set<string>> = {};

    for (const [section, value] of Object.entries(schema.groups)) {
        collectSchemaFields(value, schemaFields);
        collectSchemaFieldsBySection(value, sectionFields, section);
    }

    const requiredMissing = missingFields(rows, schema.requiredFields ?? []);
    const excelFields = new Set([...rows.keys()]);
    const schemaFieldKeys = new Set([...schemaFields].map(normalizeHeaderKey));
    const unmappedExcel = [...excelFields].filter((field) => !schemaFieldKeys.has(field));

    const errors: string[] = [];
    requiredMissing.forEach((field) => errors.push(`Missing required field: ${field}`));

    if (strict) {
        duplicates.forEach((field) => errors.push(`Duplicate Excel header: ${field}`));
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