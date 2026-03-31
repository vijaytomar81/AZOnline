// src/dataLayer/builder/core/schemaValidation/computeMissingFields.ts

import { normKey } from "../spreadsheet";
import type { SectionFieldGroup } from "../../types";

export function missingFields(
    rows: Map<string, number>,
    fields: Iterable<string>
): string[] {
    return [...fields].filter((field) => !rows.has(normKey(field)));
}

export function buildSectionBuckets(
    rows: Map<string, number>,
    sectionFields: Record<string, Set<string>>,
    requiredFields: string[]
): Record<string, SectionFieldGroup> {
    const requiredSet = new Set(requiredFields.map(normKey));
    const out: Record<string, SectionFieldGroup> = {};

    for (const [section, fields] of Object.entries(sectionFields)) {
        const requiredMissing: string[] = [];
        const mappedMissing: string[] = [];

        for (const field of fields) {
            if (rows.has(normKey(field))) {
                continue;
            }

            if (requiredSet.has(normKey(field))) {
                requiredMissing.push(field);
            } else {
                mappedMissing.push(field);
            }
        }

        if (requiredMissing.length || mappedMissing.length) {
            out[section] = {
                requiredFields: requiredMissing,
                schemaMappingFields: mappedMissing,
            };
        }
    }

    return out;
}

export function countMissingSchemaFields(
    bySection: Record<string, SectionFieldGroup>
): number {
    return Object.values(bySection).reduce((sum, group) => {
        return sum + group.requiredFields.length + group.schemaMappingFields.length;
    }, 0);
}