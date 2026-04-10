// src/evidenceLayer/artifacts/excel/buildExecutionItemRows.ts

import type { EvidenceFieldDefinition } from "@configLayer/models/evidence/types";

type EvidenceCase = Record<string, unknown>;
type EvidenceCases = Record<string, EvidenceCase>;
type EvidenceItemResult = Record<string, unknown>;

type EvidenceViewField = EvidenceFieldDefinition & {
    toJSON?: boolean;
    toExcel?: boolean;
};

export type ExecutionCaseRow = Record<string, string | number | boolean>;

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

function getBooleanOrBlank(value: unknown): boolean | string {
    if (typeof value === "boolean") {
        return value;
    }

    const text = String(value ?? "").trim().toLowerCase();
    if (!text) {
        return "";
    }

    if (text === "true") {
        return true;
    }

    if (text === "false") {
        return false;
    }

    return String(value ?? "");
}

function getPathValue(
    source: Record<string, unknown>,
    key: string
): unknown {
    if (!key) {
        return undefined;
    }

    if (key in source) {
        return source[key];
    }

    return key.split(".").reduce<unknown>((current, part) => {
        if (!current || typeof current !== "object" || Array.isArray(current)) {
            return undefined;
        }

        return (current as Record<string, unknown>)[part];
    }, source);
}

function getOutputValue(
    outputs: Record<string, unknown>,
    key: string
): unknown {
    const exact = getPathValue(outputs, key);

    if (exact !== undefined) {
        return exact;
    }

    const normalizedKey = key.trim().toLowerCase();

    if (!normalizedKey) {
        return undefined;
    }

    for (const [outputKey, outputValue] of Object.entries(outputs)) {
        const normalizedOutputKey = outputKey.trim().toLowerCase();

        if (
            normalizedOutputKey === normalizedKey ||
            normalizedOutputKey.endsWith(`.${normalizedKey}`)
        ) {
            return outputValue;
        }
    }

    return undefined;
}

function resolveFieldValue(args: {
    scenarioId: string;
    scenario: EvidenceCase;
    item: EvidenceItemResult;
    field: EvidenceViewField;
}): unknown {
    const details = asRecord(args.item.details);
    const outputs = asRecord(details.outputs);

    const candidates: unknown[] = [
        getPathValue(args.item, args.field.key),
        getPathValue(details, args.field.key),
        getOutputValue(outputs, args.field.key),
        getPathValue(args.scenario, args.field.key),
    ];

    if (args.field.key === "scenarioId") {
        candidates.push(args.scenario.scenarioId ?? args.scenarioId);
    }

    if (args.field.key === "status" && args.item.status !== undefined) {
        candidates.unshift(args.item.status);
    }

    if (args.field.key === "testCaseRef" && details.testCaseRef !== undefined) {
        candidates.unshift(details.testCaseRef);
    }

    if (args.field.key === "subType" && details.subType !== undefined) {
        candidates.unshift(details.subType);
    }

    if (args.field.key === "portal" && details.portal !== undefined) {
        candidates.unshift(details.portal);
    }

    if (
        args.field.key === "errorDetails" &&
        (details.errorDetails !== undefined || args.item.message !== undefined)
    ) {
        candidates.unshift(details.errorDetails ?? args.item.message);
    }

    return candidates.find((value) => value !== undefined);
}

function formatFieldValue(
    value: unknown,
    valueType: EvidenceFieldDefinition["valueType"]
): string | number | boolean {
    if (valueType === "number") {
        return getNumberOrBlank(value);
    }

    if (valueType === "boolean") {
        return getBooleanOrBlank(value);
    }

    if (valueType === "json") {
        if (value === undefined || value === null || value === "") {
            return "";
        }

        return JSON.stringify(value);
    }

    return getString(value);
}

function buildItemRow(args: {
    scenarioId: string;
    scenario: EvidenceCase;
    item: EvidenceItemResult;
    fields: readonly EvidenceViewField[];
}): ExecutionCaseRow {
    const row: ExecutionCaseRow = {};

    args.fields
        .filter((field) => field.toExcel !== false)
        .forEach((field) => {
            const value = resolveFieldValue({
                scenarioId: args.scenarioId,
                scenario: args.scenario,
                item: args.item,
                field,
            });

            row[field.label] = formatFieldValue(value, field.valueType);
        });

    return row;
}

export function buildExecutionItemRows(args: {
    cases: EvidenceCases;
    fields: readonly EvidenceViewField[];
}): ExecutionCaseRow[] {
    const rows: ExecutionCaseRow[] = [];

    Object.entries(args.cases).forEach(([scenarioId, scenario]) => {
        const itemResults = asItemResults(scenario.itemResults);

        itemResults.forEach((item) => {
            rows.push(
                buildItemRow({
                    scenarioId,
                    scenario,
                    item,
                    fields: args.fields,
                })
            );
        });
    });

    return rows;
}
