// src/data/data-builder/plugins/05-validate-schema.ts
import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import { getSchema } from "../../input-data-schema";
import { buildRowIndex, cellToString, detectLayout, norm, normKey } from "../core/excelRuntime";

function collectSchemaFields(obj: any, out: Set<string>) {
    if (!obj || typeof obj !== "object") return;
    for (const value of Object.values(obj)) {
        if (typeof value === "string") out.add(value);
        else if (typeof value === "object") collectSchemaFields(value, out);
    }
}

function collectExcelFields(ws: ExcelJS.Worksheet, fieldCol: number, dataStartRow: number) {
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

function missingFields(rows: Map<string, number>, fields: Iterable<string>) {
    return [...fields].filter((f) => !rows.has(normKey(f)));
}

function validateRepeatedCounts(
    ws: ExcelJS.Worksheet,
    rowIndex: Map<string, number>,
    caseStartCol: number,
    strict: boolean
): string[] {
    const issues: string[] = [];
    const maxCol = ws.columnCount || ws.actualColumnCount || 0;
    const adCountRow = rowIndex.get(normKey("AdditionalDriversCount"));

    if (!strict || !adCountRow) return issues;

    for (let c = caseStartCol; c <= maxCol; c++) {
        const raw = norm(cellToString(ws.getCell(adCountRow, c).value));
        if (!raw) break;

        const count = Number(raw || 0);
        if (!Number.isFinite(count)) {
            issues.push(`Invalid AdditionalDriversCount "${raw}" at column ${c}`);
            continue;
        }

        for (let i = 1; i <= 5; i++) {
            const key = normKey(`AD${i}FirstName`);
            const row = rowIndex.get(key);
            const hasDriverData = row ? norm(cellToString(ws.getCell(row, c).value)) !== "" : false;

            if (i <= count && !hasDriverData) {
                issues.push(`AD${i} missing while AdditionalDriversCount=${count} at column ${c}`);
            }
            if (i > count && hasDriverData) {
                issues.push(`AD${i} has data beyond AdditionalDriversCount=${count} at column ${c}`);
            }
        }
    }

    return issues;
}

const plugin: PipelinePlugin = {
    name: "validate-schema",
    order: 5,
    requires: ["sheet", "external:schemaName", "external:strictValidation"],
    provides: [],

    run: async (ctx) => {
        const ws = ctx.data.sheet as ExcelJS.Worksheet | undefined;
        if (!ws) throw new Error("Sheet not loaded.");
        if (!ctx.data.schemaName) throw new Error("schemaName is required.");

        const strict = !!ctx.data.strictValidation;
        const schema = getSchema(ctx.data.schemaName);
        const layout = detectLayout(ws);
        const { rows, duplicates } = collectExcelFields(ws, layout.fieldCol, layout.dataStartRow);

        const schemaFields = new Set<string>();
        collectSchemaFields(schema.groups, schemaFields);

        for (const rep of Object.values(schema.repeatedGroups ?? {})) {
            schemaFields.add(rep.countField);
            collectSchemaFields(rep.groups, schemaFields);
        }

        const requiredMissing = missingFields(rows, schema.requiredFields ?? []);
        const mappedMissing = missingFields(rows, schemaFields);
        const strictIssues = validateRepeatedCounts(ws, rows, layout.caseStartCol, strict);

        const errors = [
            ...requiredMissing.map((f) => `Missing required field: ${f}`),
            ...mappedMissing.map((f) => `Missing mapped field: ${f}`),
            ...(strict ? duplicates.map((f) => `Duplicate Excel field: ${f}`) : []),
            ...strictIssues,
        ];

        ctx.log.info(`Validating schema "${ctx.data.schemaName}" (${strict ? "strict" : "normal"})`);
        ctx.log.debug?.(`Excel fields detected=${rows.size}`);
        ctx.log.debug?.(`Schema fields checked=${schemaFields.size}`);

        if (errors.length) {
            errors.slice(0, 20).forEach((e) => ctx.log.error(e));
            throw new Error(`Schema validation failed with ${errors.length} issue(s).`);
        }

        ctx.log.info("Schema validation passed ✅");
    },
};

export default plugin;