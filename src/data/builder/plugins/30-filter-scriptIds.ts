// src/data/builder/plugins/30-filter-scriptIds.ts

import type { PipelinePlugin } from "../core/pipeline";
import type { DataBuilderContext } from "../types";
import { DataBuilderError } from "../errors";

function expandScriptIdFilter(raw: string): Set<string> {
    const result = new Set<string>();
    const input = (raw ?? "").trim();
    if (!input) return result;

    const parts = input.split(",");

    for (const p of parts) {
        const part = p.trim();
        if (!part) continue;

        if (part.includes("-")) {
            const [aRaw, bRaw] = part.split("-").map((x) => x.trim());
            const a = Number(aRaw);
            const b = Number(bRaw);

            if (!Number.isFinite(a) || !Number.isFinite(b)) {
                throw new DataBuilderError({
                    code: "INVALID_SCRIPT_ID_RANGE",
                    stage: "filter-scriptIds",
                    source: "30-filter-scriptIds",
                    message: `Invalid scriptId range: "${part}"`,
                    context: { rawFilter: raw },
                });
            }

            const start = Math.min(a, b);
            const end = Math.max(a, b);

            for (let i = start; i <= end; i++) {
                result.add(String(i));
            }
            continue;
        }

        result.add(part);
    }

    return result;
}

const plugin: PipelinePlugin = {
    name: "filter-scriptIds",
    order: 30,
    requires: ["casesFile", "external:scriptIdFilter"],

    run: async (ctx: DataBuilderContext) => {
        const casesFile = ctx.data.casesFile;

        if (!casesFile) {
            throw new DataBuilderError({
                code: "CASES_FILE_MISSING",
                stage: "filter-scriptIds",
                source: "30-filter-scriptIds",
                message: "casesFile missing. build-cases must run before filter-scriptIds.",
            });
        }

        const rawFilter = String(ctx.data.scriptIdFilter ?? "").trim();

        if (!rawFilter) {
            ctx.log.info("No scriptId filter provided. Keeping all cases.");
            return;
        }

        const allowed = expandScriptIdFilter(rawFilter);

        if (allowed.size === 0) {
            throw new DataBuilderError({
                code: "EMPTY_SCRIPT_ID_FILTER",
                stage: "filter-scriptIds",
                source: "30-filter-scriptIds",
                message: "scriptIdFilter provided but no valid IDs found.",
                context: { rawFilter },
            });
        }

        ctx.log.info(`Filtering script IDs: ${rawFilter}`);

        const before = casesFile.cases.length;

        const filtered = casesFile.cases.filter((c) =>
            allowed.has(String(c.scriptId ?? "").trim())
        );

        const found = new Set(filtered.map((c) => String(c.scriptId ?? "").trim()));

        for (const id of allowed) {
            if (!found.has(id)) {
                throw new DataBuilderError({
                    code: "SCRIPT_ID_NOT_FOUND",
                    stage: "filter-scriptIds",
                    source: "30-filter-scriptIds",
                    message: `Requested scriptId "${id}" not found in sheet.`,
                    context: {
                        requestedId: id,
                        availableIds: casesFile.cases.map((c) => c.scriptId).join(", "),
                    },
                });
            }
        }

        casesFile.cases = filtered;
        casesFile.caseCount = filtered.length;

        ctx.log.info(`Cases after filter: ${casesFile.caseCount} (from ${before})`);
    },
};

export default plugin;