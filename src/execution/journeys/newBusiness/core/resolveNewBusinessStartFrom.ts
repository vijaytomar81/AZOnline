// src/execution/journeys/newBusiness/core/resolveNewBusinessStartFrom.ts

import type { NewBusinessStartFrom } from "./types";
import { normalizeStartFromKey } from "./normalizeStartFromKey";

export function resolveNewBusinessStartFrom(args: {
    journey?: string;
    entryPoint?: string;
}): NewBusinessStartFrom {
    const normalizedJourney = normalizeStartFromKey(args.journey);
    const normalizedEntryPoint = normalizeStartFromKey(args.entryPoint);

    if (normalizedEntryPoint === "pcwtool") return "PCWTool";
    if (normalizedEntryPoint === "pcw") return "PCW";
    if (normalizedJourney === "direct") return "Direct";

    return "PCW";
}
