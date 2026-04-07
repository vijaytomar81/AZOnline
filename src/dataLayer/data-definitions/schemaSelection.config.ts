// src/dataLayer/data-definitions/schemaSelection.config.ts

import {
    JOURNEY_TYPES,
    type JourneyContext,
} from "@configLayer/models/journeyContext.config";
import {
    PLATFORMS,
    type Platform,
} from "@configLayer/models/platform.config";

export const SCHEMA_SELECTION = {
    [JOURNEY_TYPES.NEW_BUSINESS]: {
        [PLATFORMS.ATHENA]: "new_business_journey",
        [PLATFORMS.PCW]: "new_business_journey",
        [PLATFORMS.PCW_TOOL]: "new_business_pcw_tool_message",
    },

    [JOURNEY_TYPES.MTA]: {
        [PLATFORMS.ATHENA]: "mta_journey",
        [PLATFORMS.PCW]: "mta_journey",
        [PLATFORMS.PCW_TOOL]: "mta_journey",
    },

    [JOURNEY_TYPES.RENEWAL]: {
        [PLATFORMS.ATHENA]: "renewal_journey",
        [PLATFORMS.PCW]: "renewal_journey",
        [PLATFORMS.PCW_TOOL]: "renewal_journey",
    },

    [JOURNEY_TYPES.MTC]: {
        [PLATFORMS.ATHENA]: "mtc_journey",
        [PLATFORMS.PCW]: "mtc_journey",
        [PLATFORMS.PCW_TOOL]: "mtc_journey",
    },
} as const;

export function resolveSchemaSelection(args: {
    journeyContext: JourneyContext;
    platform: Platform;
}): string | undefined {
    const byJourney = SCHEMA_SELECTION[args.journeyContext.type];
    return byJourney?.[args.platform];
}
