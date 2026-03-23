// src/data/builder/core/schemaValidationShared.ts

import type {
    RepeatedGroup,
    SchemaGroupMap,
} from "../../data-definitions/types";
import type { SectionFieldGroup, ValidationReport } from "../types";
import { normKey } from "./excelRuntime";

export function collectSchemaFields(obj: unknown, out: Set<string>) {
    if (!obj || typeof obj !== "object") return;

    for (const value of Object.values(obj as Record<string, unknown>)) {
        if (typeof value === "string") out.add(value);
        else if (typeof value === "object") collectSchemaFields(value, out);
    }
}

export function collectSchemaFieldsBySection(
    obj: unknown,
    out: Record<string, Set<string>>,
    section: string
) {
    if (!obj || typeof obj !== "object") return;

    out[section] ??= new Set<string>();

    for (const value of Object.values(obj as Record<string, unknown>)) {
        if (typeof value === "string") out[section].add(value);
        else if (typeof value === "object") {
            collectSchemaFieldsBySection(value, out, section);
        }
    }
}

export function collectLeafExcelFields(node: SchemaGroupMap, out: Set<string>) {
    if (!node || typeof node !== "object") return;

    for (const value of Object.values(node)) {
        if (!value || typeof value !== "object") continue;

        const record = value as Record<string, unknown>;
        const isLeaf = Object.values(record).every((v) => typeof v === "string");

        if (isLeaf) {
            Object.values(record).forEach((v) => out.add(String(v)));
            continue;
        }

        collectLeafExcelFields(value as SchemaGroupMap, out);
    }
}

export function expandRepeatedGroupFields(
    rep: RepeatedGroup,
    outerPrefix = ""
): Set<string> {
    const expanded = new Set<string>();
    const leafFields = new Set<string>();

    expanded.add(`${outerPrefix}${rep.countField}`);
    collectLeafExcelFields(rep.groups, leafFields);

    for (let i = 1; i <= rep.max; i++) {
        const itemPrefix = `${outerPrefix}${rep.prefixBase}${i}`;
        for (const field of leafFields) {
            expanded.add(`${itemPrefix}${field}`);
        }
    }

    return expanded;
}

export function addFields(target: Set<string>, fields: Iterable<string>) {
    for (const field of fields) target.add(field);
}

export function missingFields(rows: Map<string, number>, fields: Iterable<string>) {
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
            if (rows.has(normKey(field))) continue;

            if (requiredSet.has(normKey(field))) requiredMissing.push(field);
            else mappedMissing.push(field);
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
) {
    return Object.values(bySection).reduce((sum, group) => {
        return sum + group.requiredFields.length + group.schemaMappingFields.length;
    }, 0);
}

export function buildValidationReport(args: {
    schemaName: string;
    sheetName: string;
    strict: boolean;
    errors: string[];
    requiredMissing: string[];
    bySection: Record<string, SectionFieldGroup>;
    unmappedExcel: string[];
}): ValidationReport {
    const mode: "normal" | "strict" = args.strict ? "strict" : "normal";

    return {
        schemaName: args.schemaName,
        sheetName: args.sheetName,
        mode,
        generatedAt: new Date().toISOString(),
        errors: args.errors,
        missingSchemaFieldsInExcel: {
            requiredFields: args.requiredMissing,
            bySection: args.bySection,
        },
        missingExcelFieldsInSchema: {
            unusedExcelFields: args.unmappedExcel,
        },
        summary: {
            errorCount: args.errors.length,
            missingSchemaFieldsInExcelCount: countMissingSchemaFields(args.bySection),
            missingExcelFieldsInSchemaCount: args.unmappedExcel.length,
        },
    };
}