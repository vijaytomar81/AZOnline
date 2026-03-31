// src/dataLayer/builder/core/buildCases/tabular/buildTabularGroup.ts

import { readTabularRowValue } from "./buildTabularRowValueMap";

function isLeaf(node: unknown): node is Record<string, string> {
    return (
        !!node &&
        typeof node === "object" &&
        Object.values(node as Record<string, unknown>).every(
            (value) => typeof value === "string"
        )
    );
}

function buildLeafFromRow(
    mapping: Record<string, string>,
    rowMap: Map<string, string>,
    includeEmpty: boolean
): Record<string, unknown> {
    const out: Record<string, unknown> = {};

    for (const [jsonKey, excelField] of Object.entries(mapping)) {
        const value = readTabularRowValue(rowMap, excelField);

        if (!includeEmpty && value === "") {
            continue;
        }

        out[jsonKey] = value;
    }

    return out;
}

export function buildTabularGroup(
    node: Record<string, unknown>,
    rowMap: Map<string, string>,
    includeEmpty: boolean
): Record<string, unknown> {
    const out: Record<string, unknown> = {};

    for (const [key, child] of Object.entries(node)) {
        if (isLeaf(child)) {
            const leaf = buildLeafFromRow(child, rowMap, includeEmpty);

            if (Object.keys(leaf).length) {
                out[key] = leaf;
            }
            continue;
        }

        const nested = buildTabularGroup(
            child as Record<string, unknown>,
            rowMap,
            includeEmpty
        );

        if (Object.keys(nested).length) {
            out[key] = nested;
        }
    }

    return out;
}