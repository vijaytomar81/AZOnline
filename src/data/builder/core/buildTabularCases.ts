// src/data/builder/core/buildTabularCases.ts

import type ExcelJS from "exceljs";
import type { DataSchema } from "../../data-definitions/types";
import type { BuiltCase, DataBuilderContext, DataBuilderMeta } from "../types";
import { DataBuilderError } from "../errors";
import { buildTabularGroup } from "./buildCases/tabular/buildTabularGroup";
import { buildTabularRowValueMap } from "./buildCases/tabular/buildTabularRowValueMap";
import { emitLog } from "@logging/emitLog";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { createBuiltCase } from "./buildCases/shared/createBuiltCase";

type BuildTabularCasesArgs = {
    ctx: DataBuilderContext;
    ws: ExcelJS.Worksheet;
    meta: DataBuilderMeta;
    schema: DataSchema;
    includeEmpty: boolean;
};

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

        const rowMap = buildTabularRowValueMap(ws, m.row, headers);
        const data = buildTabularGroup(
            schema.groups as Record<string, unknown>,
            rowMap,
            includeEmpty
        );

        const builtCase = createBuiltCase({
            caseIndex: idx + 1,
            scriptName: m.scriptName,
            scriptId: m.scriptId,
            data,
        });

        if (ctx.data.verbose) {
            emitLog({
                scope: ctx.logScope,
                category: LOG_CATEGORIES.PIPELINE,
                level: LOG_LEVELS.DEBUG,
                message: [
                    `Built case -> index=${builtCase.caseIndex}`,
                    `row=${m.row}`,
                    `scriptId=${builtCase.scriptId ?? ""}`,
                    `scriptName=${builtCase.scriptName}`,
                ].join(", "),
            });
        }

        return builtCase;
    });
}