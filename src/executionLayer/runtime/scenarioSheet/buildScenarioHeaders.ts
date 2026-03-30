// src/executionLayer/runtime/scenarioSheet/buildScenarioHeaders.ts

import type ExcelJS from "exceljs";
import { normalizeHeaderKey, normalizeSpaces } from "@utils/text";
import { validateTemplateHeaders } from "@executionLayer/mode/e2e/scenario/template";

function cellToString(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;

        if ("result" in obj) {
            return cellToString(obj.result);
        }

        if ("text" in obj) {
            return String(obj.text ?? "");
        }
    }

    return String(value);
}

function getHeaders(worksheet: ExcelJS.Worksheet): string[] {
    const maxCol = worksheet.columnCount || worksheet.actualColumnCount || 0;

    return Array.from({ length: maxCol }, (_, index) =>
        normalizeSpaces(cellToString(worksheet.getCell(1, index + 1).value))
    );
}

function buildCanonicalHeaders(): Map<string, string> {
    const baseHeaders = [
        "ScenarioId",
        "ScenarioName",
        "Journey",
        "PolicyContext",
        "EntryPoint",
        "PolicyNumber",
        "LoginId",
        "Password",
        "Description",
        "Execute",
        "TotalItems",
    ];

    const map = new Map<string, string>();

    baseHeaders.forEach((header) => {
        map.set(normalizeHeaderKey(header), header);
    });

    for (let itemNo = 1; itemNo <= 20; itemNo++) {
        ["Action", "SubType", "Portal", "TestCaseRef"].forEach((suffix) => {
            const header = `Item${itemNo}${suffix}`;
            map.set(normalizeHeaderKey(header), header);
        });
    }

    return map;
}

export function buildScenarioHeaders(
    worksheet: ExcelJS.Worksheet
): string[] {
    const rawHeaders = getHeaders(worksheet);
    validateTemplateHeaders(rawHeaders);

    const canonicalHeaders = buildCanonicalHeaders();

    return rawHeaders.map((header) => canonicalHeaders.get(header) ?? header);
}
