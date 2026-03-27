// src/data/builder/core/schemaValidation/collectSchemaFields.ts

import type { SchemaGroupMap } from "../../../data-definitions/types";

export function collectSchemaFields(obj: unknown, out: Set<string>): void {
    if (!obj || typeof obj !== "object") {
        return;
    }

    for (const value of Object.values(obj as Record<string, unknown>)) {
        if (typeof value === "string") {
            out.add(value);
            continue;
        }

        if (typeof value === "object") {
            collectSchemaFields(value, out);
        }
    }
}

export function collectSchemaFieldsBySection(
    obj: unknown,
    out: Record<string, Set<string>>,
    section: string
): void {
    if (!obj || typeof obj !== "object") {
        return;
    }

    out[section] ??= new Set<string>();

    for (const value of Object.values(obj as Record<string, unknown>)) {
        if (typeof value === "string") {
            out[section].add(value);
            continue;
        }

        if (typeof value === "object") {
            collectSchemaFieldsBySection(value, out, section);
        }
    }
}

export function collectLeafExcelFields(
    node: SchemaGroupMap,
    out: Set<string>
): void {
    if (!node || typeof node !== "object") {
        return;
    }

    for (const value of Object.values(node)) {
        if (!value || typeof value !== "object") {
            continue;
        }

        const record = value as Record<string, unknown>;
        const isLeaf = Object.values(record).every((item) => typeof item === "string");

        if (isLeaf) {
            Object.values(record).forEach((item) => out.add(String(item)));
            continue;
        }

        collectLeafExcelFields(value as SchemaGroupMap, out);
    }
}