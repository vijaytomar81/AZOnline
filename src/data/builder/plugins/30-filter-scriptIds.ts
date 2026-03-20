// src/data/data-builder/plugins/30-filter-scriptIds.ts

import type { PipelinePlugin } from "../core/pipeline";
import type { DataBuilderContext } from "../types";

/**
 * Supports:
 *  "1"
 *  "1,2,5"
 *  "1-10"
 *  "1,3-10,15"
 */
function expandScriptIdFilter(raw: string): Set<string> {
    const result = new Set<string>();
    const input = (raw ?? "").trim();
    if (!input) return result;

    const parts = input.split(",");

    for (const p of parts) {
        const part = p.trim();
        if (!part) continue;

        // range
        if (part.includes("-")) {
            const [aRaw, bRaw] = part.split("-").map((x) => x.trim());
            const a = Number(aRaw);
            const b = Number(bRaw);

            if (!Number.isFinite(a) || !Number.isFinite(b)) {
                throw new Error(`Invalid scriptId range: "${part}"`);
            }

            const start = Math.min(a, b);
            const end = Math.max(a, b);

            for (let i = start; i <= end; i++) {
                result.add(String(i));
            }
            continue;
        }

        // single
        result.add(part);
    }

    return result;
}

const plugin: PipelinePlugin = {
    name: "filter-scriptIds",
    order: 30,

    // IMPORTANT: this plugin modifies casesFile.cases in-place
    // Do NOT "provide" casesFile again (prevents dependency cycles)
    requires: ["casesFile", "external:scriptIdFilter"],

    run: async (ctx: DataBuilderContext) => {
        const casesFile = ctx.data.casesFile;
        if (!casesFile) {
            throw new Error("casesFile missing. build-cases must run before filter-scriptIds.");
        }

        const rawFilter = String(ctx.data.scriptIdFilter ?? "").trim();

        // no filter -> keep all
        if (!rawFilter) {
            ctx.log.info("No scriptId filter provided. Keeping all cases.");
            return;
        }

        const allowed = expandScriptIdFilter(rawFilter);

        if (allowed.size === 0) {
            throw new Error("scriptIdFilter provided but no valid IDs found.");
        }

        ctx.log.info(`Filtering script IDs: ${rawFilter}`);

        const before = casesFile.cases.length;

        // We filter by scriptId (from excel "Script ID" row)
        const filtered = casesFile.cases.filter((c) =>
            allowed.has(String(c.scriptId ?? "").trim())
        );

        // HARD STOP if any requested id not found
        const found = new Set(filtered.map((c) => String(c.scriptId ?? "").trim()));
        for (const id of allowed) {
            if (!found.has(id)) {
                throw new Error(`Requested scriptId "${id}" not found in sheet.`);
            }
        }

        casesFile.cases = filtered;
        casesFile.caseCount = filtered.length;

        ctx.log.info(`Cases after filter: ${casesFile.caseCount} (from ${before})`);
    },
};

export default plugin;