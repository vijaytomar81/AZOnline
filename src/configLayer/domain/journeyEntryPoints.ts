// src/configLayer/domain/journeyEntryPoints.ts

export const JOURNEY_ENTRY_POINTS = {
    DIRECT: "direct",
    PCW: "pcw",
    PCW_TOOL: "pcwTool",
} as const;

export type JourneyEntryPoint =
    typeof JOURNEY_ENTRY_POINTS[keyof typeof JOURNEY_ENTRY_POINTS];

export const JOURNEY_START_SOURCES = {
    DIRECT: "Direct",
    PCW: "PCW",
    PCW_TOOL: "PCWTool",
} as const;

export type JourneyStartSource =
    typeof JOURNEY_START_SOURCES[keyof typeof JOURNEY_START_SOURCES];
