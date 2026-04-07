// src/frameworkCore/executionLayer/mode/data/resolveDataJourney.ts

import {
    JOURNEYS,
    normalizeJourney,
} from "@configLayer/domain/journey.config";

export function resolveDataJourney(args: {
    source?: string;
    schemaName: string;
}): string {
    const raw = String(args.source ?? "").trim();

    if (/pcw/i.test(raw)) {
        return normalizeJourney(raw || JOURNEYS.CTM) ?? JOURNEYS.CTM;
    }

    return (
        normalizeJourney(
            String(args.schemaName ?? "").replace(/_pcw_tool$/i, "")
        ) ?? JOURNEYS.DIRECT
    );
}
