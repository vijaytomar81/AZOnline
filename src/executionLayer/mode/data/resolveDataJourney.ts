// src/executionLayer/mode/data/resolveDataJourney.ts

import { normalizeJourney } from "@config/domain/journey.config";

export function resolveDataJourney(args: {
    schemaName: string;
    builtCase: { data?: Record<string, unknown> };
}): string {
    if (args.schemaName === "direct" || args.schemaName === "master") {
        return "Direct";
    }

    if (args.schemaName === "pcw_tool") {
        const pcwTool = (args.builtCase.data?.pcwTool ?? {}) as Record<string, unknown>;
        const raw =
            String(pcwTool.journey ?? "").trim() ||
            String(pcwTool.pcwToolPortal ?? "").trim();

        return normalizeJourney(raw || "CTM");
    }

    return normalizeJourney(args.schemaName.replace(/_pcw_tool$/i, ""));
}
