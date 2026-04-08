// src/evidenceLayer/artifacts/excel/buildExecutionItemRows.ts

import { EXECUTION_EXCEL_COLUMNS } from "./executionExcelColumns";

type EvidenceCase = Record<string, unknown>;
type EvidenceCases = Record<string, EvidenceCase>;
type EvidenceItemResult = Record<string, unknown>;

export type ExecutionCaseRow = Record<string, string | number>;

function getString(value: unknown): string {
    return String(value ?? "");
}

function getNumberOrBlank(value: unknown): number | string {
    if (typeof value === "number") return value;

    const text = String(value ?? "").trim();
    if (!text) return "";

    const parsed = Number(text);
    return Number.isFinite(parsed) ? parsed : text;
}

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function asItemResults(value: unknown): EvidenceItemResult[] {
    return Array.isArray(value)
        ? value.map((item) => asRecord(item))
        : [];
}

function buildItemRow(
    scenarioId: string,
    scenario: EvidenceCase,
    item: EvidenceItemResult
): ExecutionCaseRow {
    const row: ExecutionCaseRow = {};
    const outputs = asRecord(item.outputs);

    EXECUTION_EXCEL_COLUMNS.forEach((column) => {
        if (column.kind === "scenario") {
            const value =
                column.sourceKey === "scenarioId"
                    ? scenario.scenarioId ?? scenarioId
                    : scenario[column.sourceKey];

            row[column.header] = getString(value);
            return;
        }

        if (column.kind === "item") {
            const value = item[column.sourceKey];
            row[column.header] =
                column.sourceKey === "itemNo"
                    ? getNumberOrBlank(value)
                    : getString(value);
            return;
        }

        row[column.header] = getString(outputs[column.sourceKey]);
    });

    return row;
}

export function buildExecutionItemRows(
    cases: EvidenceCases
): ExecutionCaseRow[] {
    const rows: ExecutionCaseRow[] = [];

    Object.entries(cases).forEach(([scenarioId, scenario]) => {
        const itemResults = asItemResults(scenario.itemResults);

        itemResults.forEach((item) => {
            rows.push(buildItemRow(scenarioId, scenario, item));
        });
    });

    return rows;
}
