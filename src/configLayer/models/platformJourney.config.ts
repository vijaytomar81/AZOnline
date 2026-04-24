// src/configLayer/models/platformJourney.config.ts

import {
    JOURNEY_TYPES,
    type JourneyType,
} from "./journeyContext.config";
import {
    PLATFORMS,
    type Platform,
} from "./platform.config";

export const PLATFORM_JOURNEY_TYPES: Record<
    Platform,
    readonly JourneyType[]
> = {
    [PLATFORMS.ATHENA]: [
        JOURNEY_TYPES.NEW_BUSINESS,
        JOURNEY_TYPES.RENEWAL,
        JOURNEY_TYPES.MTC,
        JOURNEY_TYPES.MTA,
    ],

    [PLATFORMS.PCW]: [
        JOURNEY_TYPES.NEW_BUSINESS,
    ],

    [PLATFORMS.PCW_TOOL]: [
        JOURNEY_TYPES.NEW_BUSINESS,
    ],
};

export function getPlatformJourneyTypes(
    platform: Platform
): readonly JourneyType[] {
    return PLATFORM_JOURNEY_TYPES[platform];
}
