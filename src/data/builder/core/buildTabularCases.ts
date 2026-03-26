// src/data/builder/core/buildTabularCases.ts

import type ExcelJS from "exceljs";
import { normalizeHeaderKey } from "@utils/text";
import type { DataSchema } from "../../data-definitions/types";
import type { BuiltCase, DataBuilderContext, DataBuilderMeta } from "../types";
import { DataBuilderError } from "../errors";
import { cellToString, norm } from "./excelRuntime";

type BuildTabularCasesArgs = {
    ctx: DataBuilderContext;
    ws: ExcelJS.Worksheet;
    meta: DataBuilderMeta;
    schema: DataSchema;
    includeEmpty: boolean;
};

function isLeaf(node: unknown): node is Record<string, string> {
    return (
        !!node &&
        typeof node === "object" &&
        Object.values(node as Record<string, unknown>).every(
            (value) => typeof value === "string"
        )
    );
}

function buildRowValueMap(
    ws: ExcelJS.Worksheet,
    rowNo: number,
    headers: string[]
): Map<string, string> {
    const out = new Map<string, string>();

    headers.forEach((header, idx) => {
        const value = norm(cellToString(ws.getCell(rowNo, idx + 1).value));
        out.set(normalizeHeaderKey(header), value);
    });

    return out;
}

function readRowValue(rowMap: Map<string, string>, fieldName: string): string {
    return rowMap.get(normalizeHeaderKey(fieldName)) ?? "";
}

function buildLeafFromRow(
    mapping: Record<string, string>,
    rowMap: Map<string, string>,
    includeEmpty: boolean
): Record<string, unknown> {
    const out: Record<string, unknown> = {};

    for (const [jsonKey, excelField] of Object.entries(mapping)) {
        const value = readRowValue(rowMap, excelField);
        if (!includeEmpty && value === "") continue;
        out[jsonKey] = value;
    }

    return out;
}

function buildGroupFromRow(
    node: Record<string, unknown>,
    rowMap: Map<string, string>,
    includeEmpty: boolean
): Record<string, unknown> {
    const out: Record<string, unknown> = {};

    for (const [key, child] of Object.entries(node)) {
        if (isLeaf(child)) {
            const leaf = buildLeafFromRow(child, rowMap, includeEmpty);
            if (Object.keys(leaf).length) out[key] = leaf;
            continue;
        }

        const nested = buildGroupFromRow(
            child as Record<string, unknown>,
            rowMap,
            includeEmpty
        );

        if (Object.keys(nested).length) out[key] = nested;
    }

    return out;
}

function getDescription(data: Record<string, any>): string | undefined {
    return String(data.meta?.description ?? "").trim() || undefined;
}

export function buildTabularCases(
    args: BuildTabularCasesArgs
): BuiltCase[] {
    const { ctx, ws, meta, schema, includeEmpty } = args;
    const headers = meta.tabularHeaders ?? [];

    return meta.caseMetas.map((m, idx) => {
        if (!m.row) {
            throw new DataBuilderError({
                code: "TABULAR_CASE_ROW_MISSING",
                stage: "build-cases",
                source: "buildTabularCases",
                message: "Tabular case meta is missing row.",
                context: {
                    sheetName: meta.sheet,
                    caseIndex: idx + 1,
                    scriptId: m.scriptId,
                    scriptName: m.scriptName,
                },
            });
        }

        const rowMap = buildRowValueMap(ws, m.row, headers);
        const data = buildGroupFromRow(
            schema.groups as Record<string, unknown>,
            rowMap,
            includeEmpty
        );

        const builtCase: BuiltCase = {
            caseIndex: idx + 1,
            scriptName: m.scriptName,
            scriptId: m.scriptId,
            description: getDescription(data),
            data,
        };

        ctx.log.debug?.(
            [
                `Built case -> index=${builtCase.caseIndex}`,
                `row=${m.row}`,
                `scriptId=${builtCase.scriptId ?? ""}`,
                `scriptName=${builtCase.scriptName}`,
            ].join(", ")
        );

        return builtCase;
    });
}