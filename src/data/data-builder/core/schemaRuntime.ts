// src/data/data-builder/core/schemaRuntime.ts
import type ExcelJS from "exceljs";
import type { DataSchema, RepeatedGroup, SchemaGroupMap } from "../../input-data-schema/types";
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
    const fullKey = normKey(`${prefix}${field}`);
    const row = opts.rowIndex.get(fullKey);
    if (!row) return "";
    return norm(cellToString(opts.ws.getCell(row, opts.col).value));
}

function assignLeaf(
    mapping: Record<string, string>,
    opts: BuildOpts,
    prefix: string
): Record<string, any> {
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
            const leaf = assignLeaf(child, opts, prefix);
            if (Object.keys(leaf).length) out[key] = leaf;
            continue;
        }

        const nested = buildGroup(child, opts, prefix);
        if (Object.keys(nested).length) out[key] = nested;
    }

    return out;
}

function buildRepeat(rep: RepeatedGroup, opts: BuildOpts, itemBase: string, outerPrefix = "") {
    const count = Number(readValue(opts, rep.countField, outerPrefix) || 0);
    const safeCount = Number.isFinite(count) ? Math.max(0, Math.min(count, rep.max)) : 0;
    const out: Record<string, any> = { count: safeCount };

    for (let i = 1; i <= safeCount; i++) {
        const prefix = `${outerPrefix}${rep.prefixBase}${i}`;
        out[`${itemBase}${i}`] = buildGroup(rep.groups, opts, prefix);
    }

    return out;
}

function buildDriverChildren(
    driverKey: string,
    driverValue: Record<string, any>,
    schema: DataSchema,
    opts: BuildOpts
) {
    const driverPrefix = driverKey.replace(/^driver/i, "AD");
    const claimRep = schema.repeatedGroups?.additionalDriverClaims;
    const convictionRep = schema.repeatedGroups?.additionalDriverConvictions;

    if (claimRep) driverValue.claims = buildRepeat(claimRep, opts, "claim", driverPrefix);
    if (convictionRep) driverValue.convictions = buildRepeat(convictionRep, opts, "conviction", driverPrefix);
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
        const drivers = buildRepeat(reps.additionalDrivers, opts, "driver");
        for (const [key, value] of Object.entries(drivers)) {
            if (key.startsWith("driver") && value && typeof value === "object") {
                buildDriverChildren(key, value as Record<string, any>, schema, opts);
            }
        }
        payload.additionalDrivers = drivers;
    }

    return payload;
}