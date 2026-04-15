// src/frameworkCore/executionLayer/reporting/buildEvidencePayload.ts

import {
    PASSED_EVIDENCE_FIELDS,
    FAILED_EVIDENCE_FIELDS,
    ERROR_EVIDENCE_FIELDS,
    NOT_EXECUTED_EVIDENCE_FIELDS,
} from "@configLayer/models/evidence";
import type { EvidenceFieldDefinition } from "@configLayer/models/evidence/types";
import type {
    ExecutionContext,
    ExecutionItemResult,
} from "@frameworkCore/executionLayer/contracts";

type EvidenceViewField = EvidenceFieldDefinition & {
    toStructuredOutput?: boolean;
    toReportOutput?: boolean;
};

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function getPathValue(source: Record<string, unknown>, key: string): unknown {
    if (!key) return undefined;

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

function normalizeKey(value: string): string {
    return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getOutputValue(outputs: Record<string, unknown>, key: string): unknown {
    const direct = getPathValue(outputs, key);
    if (direct !== undefined) return direct;

    const normalizedKey = normalizeKey(key);

    for (const [k, v] of Object.entries(outputs)) {
        const normalized = normalizeKey(k);
        if (
            normalized === normalizedKey ||
            normalized.endsWith(normalizedKey)
        ) {
            return v;
        }
    }

    return undefined;
}

function resolveFieldValue(args: {
    context: ExecutionContext;
    result: ExecutionItemResult;
    field: EvidenceViewField;
}): unknown {
    const scenario = asRecord(args.context.scenario);
    const item = asRecord(args.result);
    const details = asRecord(args.result.details);
    const outputs = asRecord(args.context.outputs);

    const key = args.field.key;

    const candidates: unknown[] = [
        getPathValue(item, key),
        getPathValue(details, key),
        getOutputValue(outputs, key),
        getPathValue(scenario, key),
    ];

    // priority overrides (generic but safe)
    if (key === "scenarioId") {
        candidates.unshift(scenario.scenarioId);
    }

    if (key === "status") {
        candidates.unshift(args.result.status);
    }

    if (key === "testCaseRef" && details.testCaseRef !== undefined) {
        candidates.unshift(details.testCaseRef);
    }

    if (key === "subType" && details.subType !== undefined) {
        candidates.unshift(details.subType);
    }

    if (key === "portal" && details.portal !== undefined) {
        candidates.unshift(details.portal);
    }

    if (
        key === "errorDetails" &&
        (details.errorDetails !== undefined ||
            args.result.message !== undefined)
    ) {
        candidates.unshift(details.errorDetails ?? args.result.message);
    }

    return candidates.find((v) => v !== undefined);
}

function getFieldsForStatus(status: string): readonly EvidenceViewField[] {
    if (status === "failed") return FAILED_EVIDENCE_FIELDS;
    if (status === "not_executed") return NOT_EXECUTED_EVIDENCE_FIELDS;
    if (status === "error") return ERROR_EVIDENCE_FIELDS;
    return PASSED_EVIDENCE_FIELDS;
}

export function buildEvidencePayload(args: {
    context: ExecutionContext;
    result: ExecutionItemResult;
}): Record<string, unknown> {
    const fields = getFieldsForStatus(args.result.status);

    const payload: Record<string, unknown> = {};

    fields
        .filter((f) => f.toStructuredOutput !== false)
        .forEach((field) => {
            const value = resolveFieldValue({
                context: args.context,
                result: args.result,
                field,
            });

            if (value !== undefined) {
                payload[field.key] = value;
            }
        });

    return payload;
}