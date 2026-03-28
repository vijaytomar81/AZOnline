// src/execution/modes/data/core/resolveDataJourney.ts

import { normalizeJourney } from "@config/domain/journey.config";

export function resolveDataJourney(
    schemaName: string,
    builtCase: { data?: Record<string, unknown> }
): string {
    if (schemaName === "direct" || schemaName === "master") {
        return "Direct";
    }

    if (schemaName === "pcw_tool") {
        const pcwTool = (builtCase.data?.pcwTool ?? {}) as Record<string, unknown>;
        const raw =
            String(pcwTool.journey ?? "").trim() ||
            String(pcwTool.pcwToolPortal ?? "").trim();

        return normalizeJourney(raw || "CTM");
    }

    return normalizeJourney(schemaName.replace(/_pcw_tool$/i, ""));
}
