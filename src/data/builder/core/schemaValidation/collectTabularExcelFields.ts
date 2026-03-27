// src/data/builder/core/schemaValidation/collectTabularExcelFields.ts

import type ExcelJS from "exceljs";
import { normalizeHeaderKey, normalizeSpaces } from "@utils/text";

export function collectTabularExcelFields(ws: ExcelJS.Worksheet) {
    const maxCol = ws.columnCount || ws.actualColumnCount || 0;

    const headers = Array.from({ length: maxCol }, (_, idx) =>
        normalizeSpaces(String(ws.getCell(1, idx + 1).value ?? ""))
    ).filter(Boolean);

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