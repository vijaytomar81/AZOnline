// src/dataLayer/builder/core/filterScriptIds/expandScriptIdFilter.ts

import { DataBuilderError } from "../../errors";

export function expandScriptIdFilter(raw: string): Set<string> {
    const result = new Set<string>();
    const input = (raw ?? "").trim();

    if (!input) {
        return result;
    }

    const parts = input.split(",");

    for (const value of parts) {
        const part = value.trim();
        if (!part) {
            continue;
        }

        if (!part.includes("-")) {
            result.add(part);
            continue;
        }

        const [aRaw, bRaw] = part.split("-").map((item) => item.trim());
        const a = Number(aRaw);
        const b = Number(bRaw);

        if (!Number.isFinite(a) || !Number.isFinite(b)) {
            throw new DataBuilderError({
                code: "INVALID_SCRIPT_ID_RANGE",
                stage: "filter-scriptIds",
                source: "expandScriptIdFilter",
                message: `Invalid scriptId range: "${part}"`,
                context: { rawFilter: raw },
            });
        }

        const start = Math.min(a, b);
        const end = Math.max(a, b);

        for (let id = start; id <= end; id++) {
            result.add(String(id));
        }
    }

    return result;
}