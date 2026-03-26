// src/data/builder/core/schemaRuntime.ts
import type ExcelJS from "exceljs";
import type {
    DataSchema,
    RepeatedGroup,
    SchemaGroupMap,
} from "../../data-definitions/types";
import { cellToString, norm, normKey } from "./excelRuntime";

type BuildOpts = {
    ws: ExcelJS.Worksheet;
    col: number;
    rowIndex: Map<string, number>;
    includeEmpty: boolean;
};

function isLeaf(node: unknown): node is Record<string, string> {
    return !!node && typeof node === "object" && Object.values(node).every((v) => typeof v === "string");
}

function readValue(opts: BuildOpts, field: string, prefix = ""): string {
    const row = opts.rowIndex.get(normKey(`${prefix}${field}`));
    if (!row) return "";
    return norm(cellToString(opts.ws.getCell(row, opts.col).value));
}

function buildLeaf(mapping: Record<string, string>, opts: BuildOpts, prefix: string) {
    const out: Record<string, any> = {};
    for (const [jsonKey, excelField] of Object.entries(mapping)) {
        const value = readValue(opts, excelField, prefix);
        if (!opts.includeEmpty && value === "") continue;
        out[jsonKey] = value;
    }
    return out;
}

function buildGroup(node: SchemaGroupMap, opts: BuildOpts, prefix = ""): Record<string, any> {
    const out: Record<string, any> = {};

    for (const [key, child] of Object.entries(node)) {
        if (isLeaf(child)) {
            const leaf = buildLeaf(child, opts, prefix);
            if (Object.keys(leaf).length) out[key] = leaf;
            continue;
        }

        const nested = buildGroup(child, opts, prefix);
        if (Object.keys(nested).length) out[key] = nested;
    }

    return out;
}

function buildRepeat(rep: RepeatedGroup, opts: BuildOpts, itemKeyPrefix: string, outerPrefix = "") {
    const count = Number(readValue(opts, rep.countField, outerPrefix) || 0);
    const safeCount = Number.isFinite(count) ? Math.max(0, Math.min(count, rep.max)) : 0;

    const out: Record<string, any> = { count: safeCount };
    for (let i = 1; i <= safeCount; i++) {
        const itemPrefix = `${outerPrefix}${rep.prefixBase}${i}`;
        out[`${itemKeyPrefix}${i}`] = buildGroup(rep.groups, opts, itemPrefix);
    }

    return out;
}

function attachAdditionalDriverChildren(
    additionalDrivers: Record<string, any>,
    schema: DataSchema,
    opts: BuildOpts
) {
    const claimTemplate = schema.repeatedGroups?.additionalDriverClaims;
    const convictionTemplate = schema.repeatedGroups?.additionalDriverConvictions;

    for (const [driverKey, driverValue] of Object.entries(additionalDrivers)) {
        if (!driverKey.startsWith("driver") || !driverValue || typeof driverValue !== "object") continue;

        const driverIndex = driverKey.replace("driver", "");
        const driverPrefix = `AD${driverIndex}`;

        if (claimTemplate) {
            (driverValue as Record<string, any>).claims = buildRepeat(
                claimTemplate,
                opts,
                "claim",
                driverPrefix
            );
        }

        if (convictionTemplate) {
            (driverValue as Record<string, any>).convictions = buildRepeat(
                convictionTemplate,
                opts,
                "conviction",
                driverPrefix
            );
        }
    }
}

export function buildPayload(schema: DataSchema, opts: BuildOpts): Record<string, any> {
    const payload = buildGroup(schema.groups, opts);
    const reps = schema.repeatedGroups ?? {};

    if (reps.policyHolderClaims) {
        payload.policyHolderClaims = buildRepeat(reps.policyHolderClaims, opts, "claim");
    }

    if (reps.policyHolderConvictions) {
        payload.policyHolderConvictions = buildRepeat(reps.policyHolderConvictions, opts, "conviction");
    }

    if (reps.additionalDrivers) {
        payload.additionalDrivers = buildRepeat(reps.additionalDrivers, opts, "driver");
        attachAdditionalDriverChildren(payload.additionalDrivers, schema, opts);
    }

    return payload;
}