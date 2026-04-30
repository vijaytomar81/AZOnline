// src/toolingLayer/businessJourneys/common/reporting/types.ts

export type JourneyGenerationStatus =
    | "created"
    | "updated"
    | "unchanged"
    | "failed";

export type JourneyTreeLeaf = {
    segments: string[];
    status: JourneyGenerationStatus;
    summary: string;
};
