// src/dataLayer/builder/core/buildVerticalCases.ts

import type ExcelJS from "exceljs";
import type { DataSchema } from "../../data-definitions/types";
import type { BuiltCase, DataBuilderContext, DataBuilderMeta } from "../types";
import { DataBuilderError } from "../errors";
import { buildRowIndex } from "./spreadsheet";
import { buildPayload } from "./schemaRuntime";
import { createBuiltCase } from "./buildCases/shared/createBuiltCase";
import { emitLog } from "@logging/emitLog";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { logBuiltVerticalCase } from "./buildCases/vertical/logBuiltVerticalCase";
import { LOG_LEVELS } from "@logging/core/logLevels";

type BuildVerticalCasesArgs = {
    ctx: DataBuilderContext;
    ws: ExcelJS.Worksheet;
    meta: DataBuilderMeta;
    schema: DataSchema;
    includeEmpty: boolean;
};

export function buildVerticalCases(
    args: BuildVerticalCasesArgs
): BuiltCase[] {
    const { ctx, ws, meta, schema, includeEmpty } = args;

    if (!meta.fieldCol) {
        throw new DataBuilderError({
            code: "VERTICAL_FIELD_COLUMN_MISSING",
            stage: "build-cases",
            source: "buildVerticalCases",
            message: "Vertical layout requires fieldCol.",
            context: {
                sheetName: meta.sheet,
                layout: meta.layout,
            },
        });
    }

    const rowIndex = buildRowIndex(ws, meta.fieldCol, meta.dataStartRow);

    if (ctx.data.verbose) {
        emitLog({
            scope: ctx.logScope,
            category: LOG_CATEGORIES.PIPELINE,
            level: LOG_LEVELS.DEBUG,
            message: `rowIndex size=${rowIndex.size}`,
        });
    }

    return meta.caseMetas.map((m, idx) => {
        if (!m.col) {
            throw new DataBuilderError({
                code: "VERTICAL_CASE_COLUMN_MISSING",
                stage: "build-cases",
                source: "buildVerticalCases",
                message: "Vertical case meta is missing col.",
                context: {
                    sheetName: meta.sheet,
                    caseIndex: idx + 1,
                    scriptId: m.scriptId,
                    scriptName: m.scriptName,
                },
            });
        }

        const data = buildPayload(schema, {
            ws,
            col: m.col,
            rowIndex,
            includeEmpty,
        });

        const builtCase = createBuiltCase({
            caseIndex: idx + 1,
            scriptName: m.scriptName,
            scriptId: m.scriptId,
            data,
        });

        logBuiltVerticalCase({
            ctx,
            builtCase,
            data,
        });

        return builtCase;
    });
}