// src/execution/runtime/scenarioSheet/headers/getHeaders.ts

import type ExcelJS from "exceljs";
import { normalizeSpaces } from "@utils/text";
import { cellToString } from "../shared/cellToString";

export function getHeaders(worksheet: ExcelJS.Worksheet): string[] {
    const maxCol = worksheet.columnCount || worksheet.actualColumnCount || 0;

    return Array.from({ length: maxCol }, (_, idx) =>
        normalizeSpaces(cellToString(worksheet.getCell(1, idx + 1).value))
    );
}
