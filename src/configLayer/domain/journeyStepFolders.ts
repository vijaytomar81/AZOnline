// src/configLayer/domain/journeyStepFolders.ts

export const JOURNEY_STEP_FOLDERS = {
    ATHENA: "athena",
    PARTNER: "partner",
} as const;

export type JourneyStepFolder =
    typeof JOURNEY_STEP_FOLDERS[keyof typeof JOURNEY_STEP_FOLDERS];
