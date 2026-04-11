// src/frameworkCore/executionLayer/reporting/buildEvidenceMetaPayload.ts

import { META_EVIDENCE_FIELDS } from "@configLayer/models/evidence";
import type { EvidenceFieldDefinition } from "@configLayer/models/evidence/types";

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

export function buildEvidenceMetaPayload(args: {
    source: Record<string, unknown>;
}): Record<string, unknown> {
    const source = asRecord(args.source);
    const payload: Record<string, unknown> = {};

    (META_EVIDENCE_FIELDS as readonly EvidenceViewField[])
        .filter((field) => field.toStructuredOutput !== false)
        .forEach((field) => {
            const value = getPathValue(source, field.key);

            if (value !== undefined) {
                payload[field.key] = value;
            }
        });

    return payload;
}