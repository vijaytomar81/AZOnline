// src/data/data-builder/plugins/40-prune-additional-drivers.ts

import type { PipelinePlugin } from "../core/pipeline";
import type { DataBuilderContext } from "../types";

/**
 * Find value by walking the object tree.
 * Returns the first match where predicate(key) is true.
 */
function findKeyDeep(obj: any, predicate: (key: string) => boolean): any {
    if (!obj || typeof obj !== "object") return undefined;

    for (const k of Object.keys(obj)) {
        if (predicate(k)) return obj[k];
        const v = obj[k];
        if (v && typeof v === "object") {
            const found = findKeyDeep(v, predicate);
            if (found !== undefined) return found;
        }
    }
    return undefined;
}

/**
 * Find a parent object that contains a key (case-insensitive).
 * Returns { parent, key } if found.
 */
function findParentOfKeyDeep(
    obj: any,
    predicate: (key: string) => boolean
): { parent: any; key: string } | undefined {
    if (!obj || typeof obj !== "object") return undefined;

    for (const k of Object.keys(obj)) {
        if (predicate(k)) return { parent: obj, key: k };

        const v = obj[k];
        if (v && typeof v === "object") {
            const found = findParentOfKeyDeep(v, predicate);
            if (found) return found;
        }
    }
    return undefined;
}

function ensureAdditionalDriversGroup(payload: any): any {
    // Prefer "AdditionalDrivers" but also support legacy "P__AdditionalDrivers"
    const grpHit =
        findParentOfKeyDeep(payload, (k) => k.toLowerCase() === "additionaldrivers") ??
        findParentOfKeyDeep(payload, (k) => k.toLowerCase() === "p__additionaldrivers");

    let grp: any;

    if (grpHit) {
        grp = grpHit.parent[grpHit.key];
        if (!grp || typeof grp !== "object") {
            grp = {};
            grpHit.parent[grpHit.key] = grp;
        }
        // If the group exists under legacy key, we still keep it as-is (no rename)
        return grp;
    }

    // Create the group at root using "AdditionalDrivers"
    grp = payload["AdditionalDrivers"];
    if (!grp || typeof grp !== "object") {
        grp = {};
        payload["AdditionalDrivers"] = grp;
    }
    return grp;
}

function setAdditionalDriversCount(groupObj: any, safeCount: number) {
    const hit = findParentOfKeyDeep(groupObj, (k) => k.toLowerCase() === "additionaldriverscount");
    if (hit) hit.parent[hit.key] = safeCount;
    else groupObj["AdditionalDriversCount"] = safeCount;
}

/**
 * Collect AdditionalDriver objects from anywhere in payload.
 * We only care about driver blocks of the form:
 * - AdditionalDriver1..AdditionalDriver5
 * - P__AdditionalDriver1..P__AdditionalDriver5
 *
 * Returns array of { parentObj, key, idx, value } so we can MOVE/delete safely.
 */
function collectDriverBlocks(payload: any): Array<{
    parent: any;
    key: string;
    idx: number;
    value: any;
}> {
    const found: Array<{ parent: any; key: string; idx: number; value: any }> = [];

    const walk = (obj: any) => {
        if (!obj || typeof obj !== "object") return;

        for (const key of Object.keys(obj)) {
            const m = /^(?:p__)?additionaldriver(\d+)$/i.exec(key);
            if (m) {
                const idx = Number(m[1]);
                if (Number.isFinite(idx)) {
                    found.push({ parent: obj, key, idx, value: obj[key] });
                }
            }

            const v = obj[key];
            if (v && typeof v === "object") walk(v);
        }
    };

    walk(payload);
    return found;
}

/**
 * Move driver blocks into group (when count > 0), or delete them (when count = 0).
 * Also remove any driver blocks with idx > safeCount.
 */
function normalizeDriversUnderGroup(payload: any, safeCount: number, groupObj: any) {
    // Always remove any existing driver blocks inside group first (we will re-add cleanly)
    for (const key of Object.keys(groupObj)) {
        if (/^(?:p__)?additionaldriver\d+$/i.test(key)) delete groupObj[key];
    }

    // Collect driver blocks from anywhere (root-level or nested)
    const drivers = collectDriverBlocks(payload);

    for (const d of drivers) {
        // remove original always (we'll re-add only what we need)
        delete d.parent[d.key];

        // skip any beyond allowed count
        if (d.idx > safeCount) continue;

        // if safeCount=0, skip all
        if (safeCount === 0) continue;

        // Put under group using canonical key: "AdditionalDriverN"
        const canonicalKey = `AdditionalDriver${d.idx}`;
        groupObj[canonicalKey] = d.value;
    }
}

const plugin: PipelinePlugin = {
    name: "prune-additional-drivers",
    order: 40,
    requires: ["casesFile"],

    run: async (ctx: DataBuilderContext) => {
        const casesFile = ctx.data.casesFile;
        if (!casesFile) {
            throw new Error("casesFile missing. build-cases must run before prune-additional-drivers.");
        }

        let applied = 0;

        for (const c of casesFile.cases) {
            const payload = c.data;

            // Find AdditionalDriversCount anywhere (case-insensitive)
            const rawCount = findKeyDeep(payload, (k) => k.toLowerCase() === "additionaldriverscount");

            // Keep existing behavior: only act when count exists in payload
            if (rawCount === undefined) continue;

            const count = Number(String(rawCount).trim());
            const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;

            // Ensure group exists
            const grp = ensureAdditionalDriversGroup(payload);

            // Ensure count exists + is number
            setAdditionalDriversCount(grp, safeCount);

            // ✅ Move AdditionalDriver1..N under group (only if safeCount > 0)
            // ✅ If safeCount = 0 => remove all driver blocks anywhere
            normalizeDriversUnderGroup(payload, safeCount, grp);

            applied++;
        }

        ctx.log.info(`AdditionalDriversCount normalization applied to ${applied} case(s).`);
    },
};

export default plugin;