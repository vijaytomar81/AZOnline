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
    if (typeof value === "number") {
        return value;
    }

    const text = String(value ?? "").trim();
    if (!text) {
        return "";
    }

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

function getScenarioValue(args: {
    scenarioId: string;
    scenario: EvidenceCase;
    sourceKey: string;
}): unknown {
    if (args.sourceKey === "scenarioId") {
        return args.scenario.scenarioId ?? args.scenarioId;
    }

    if (args.sourceKey === "scenarioStatus") {
        return args.scenario.status;
    }

    return args.scenario[args.sourceKey];
}

function getItemValue(args: {
    item: EvidenceItemResult;
    sourceKey: string;
}): unknown {
    const details = asRecord(args.item.details);

    switch (args.sourceKey) {
        case "testCaseRef":
            return details.testCaseRef;
        case "errorDetails":
            return details.errorDetails ?? args.item.message;
        case "subType":
            return details.subType;
        case "portal":
            return details.portal;
        default:
            return args.item[args.sourceKey];
    }
}

function getItemOutputs(item: EvidenceItemResult): Record<string, unknown> {
    const details = asRecord(item.details);
    return asRecord(details.outputs);
}

function buildItemRow(
    scenarioId: string,
    scenario: EvidenceCase,
    item: EvidenceItemResult
): ExecutionCaseRow {
    const row: ExecutionCaseRow = {};
    const outputs = getItemOutputs(item);

    EXECUTION_EXCEL_COLUMNS.forEach((column) => {
        if (column.kind === "scenario") {
            row[column.header] = getString(
                getScenarioValue({
                    scenarioId,
                    scenario,
                    sourceKey: column.sourceKey,
                })
            );
            return;
        }

        if (column.kind === "item") {
            const value = getItemValue({
                item,
                sourceKey: column.sourceKey,
            });

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
