// src/data/builder/core/buildVerticalCases.ts

import type ExcelJS from "exceljs";
import type { DataSchema } from "../../data-definitions/types";
import type { BuiltCase, DataBuilderContext, DataBuilderMeta } from "../types";
import { DataBuilderError } from "../errors";
import { buildRowIndex } from "./excelRuntime";
import { buildPayload } from "./schemaRuntime";

type BuildVerticalCasesArgs = {
    ctx: DataBuilderContext;
    ws: ExcelJS.Worksheet;
    meta: DataBuilderMeta;
    schema: DataSchema;
    includeEmpty: boolean;
};

function getDescription(data: Record<string, any>): string | undefined {
    return String(data.meta?.description ?? "").trim() || undefined;
}

function logVerticalCase(
    ctx: DataBuilderContext,
    builtCase: BuiltCase,
    data: Record<string, any>
): void {
    const additionalDriversCount =
        Number(data.additionalDrivers?.count ?? 0) || 0;
    const policyHolderClaimsCount =
        Number(data.policyHolderClaims?.count ?? 0) || 0;
    const policyHolderConvictionsCount =
        Number(data.policyHolderConvictions?.count ?? 0) || 0;

    ctx.log.debug?.(
        [
            `Built case -> index=${builtCase.caseIndex}`,
            `scriptId=${builtCase.scriptId ?? ""}`,
            `scriptName=${builtCase.scriptName}`,
            `policyHolderClaims=${policyHolderClaimsCount}`,
            `policyHolderConvictions=${policyHolderConvictionsCount}`,
            `additionalDrivers=${additionalDriversCount}`,
        ].join(", ")
    );
}

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

    ctx.log.debug?.(`rowIndex size=${rowIndex.size}`);

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

        const builtCase: BuiltCase = {
            caseIndex: idx + 1,
            scriptName: m.scriptName,
            scriptId: m.scriptId,
            description: getDescription(data),
            data,
        };

        logVerticalCase(ctx, builtCase, data);
        return builtCase;
    });
}