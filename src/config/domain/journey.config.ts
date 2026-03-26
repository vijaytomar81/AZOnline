// src/config/domain/journey.config.ts

export const JOURNEYS = {
    DIRECT: "Direct",
    CTM: "CTM",
    CNF: "CNF",
    MSM: "MSM",
    GOCO: "GoCo",
} as const;

export type Journey = (typeof JOURNEYS)[keyof typeof JOURNEYS];

const JOURNEY_NORMALIZATION_MAP: Record<string, Journey> = {
    direct: JOURNEYS.DIRECT,
    master: JOURNEYS.DIRECT,
    ctm: JOURNEYS.CTM,
    cnf: JOURNEYS.CNF,
    msm: JOURNEYS.MSM,
    goco: JOURNEYS.GOCO,
};

export function normalizeJourney(raw?: string): Journey {
    const key = String(raw ?? "").trim().toLowerCase();
    if (!key) return JOURNEYS.DIRECT;
    return JOURNEY_NORMALIZATION_MAP[key] ?? (raw as Journey);
}

export const JOURNEY_TO_PCW_MAP = {
    CTM: "ctmMotorUrl",
    CNF: "cnfUrl",
    MSM: "msmUrl",
    GOCO: "gocoUrl",
} as const;