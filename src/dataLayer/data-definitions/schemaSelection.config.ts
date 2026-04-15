// src/dataLayer/data-definitions/schemaSelection.config.ts

import {
    JOURNEY_TYPES,
    type JourneyContext,
} from "@configLayer/models/journeyContext.config";
import {
    PLATFORMS,
    type Platform,
} from "@configLayer/models/platform.config";
import {
    PRODUCTS,
    type Product,
} from "@configLayer/models/product.config";

export const SCHEMA_SELECTION = {
    [JOURNEY_TYPES.NEW_BUSINESS]: {
        [PLATFORMS.ATHENA]: {
            [PRODUCTS.MOTOR]: "new_business_journey",
            [PRODUCTS.HOME]: "new_business_journey",
        },
        [PLATFORMS.PCW]: {
            [PRODUCTS.MOTOR]: "new_business_journey",
            [PRODUCTS.HOME]: "new_business_journey",
        },
        [PLATFORMS.PCW_TOOL]: {
            [PRODUCTS.MOTOR]: "new_business_pcw_tool_message",
            [PRODUCTS.HOME]: "new_business_pcw_tool_message",
        },
    },

    [JOURNEY_TYPES.MTA]: {
        [PLATFORMS.ATHENA]: {
            [PRODUCTS.MOTOR]: "mta_journey",
            [PRODUCTS.HOME]: "mta_journey",
        },
        [PLATFORMS.PCW]: {
            [PRODUCTS.MOTOR]: "mta_journey",
            [PRODUCTS.HOME]: "mta_journey",
        },
        [PLATFORMS.PCW_TOOL]: {
            [PRODUCTS.MOTOR]: "mta_journey",
            [PRODUCTS.HOME]: "mta_journey",
        },
    },

    [JOURNEY_TYPES.RENEWAL]: {
        [PLATFORMS.ATHENA]: {
            [PRODUCTS.MOTOR]: "renewal_journey",
            [PRODUCTS.HOME]: "renewal_journey",
        },
        [PLATFORMS.PCW]: {
            [PRODUCTS.MOTOR]: "renewal_journey",
            [PRODUCTS.HOME]: "renewal_journey",
        },
        [PLATFORMS.PCW_TOOL]: {
            [PRODUCTS.MOTOR]: "renewal_journey",
            [PRODUCTS.HOME]: "renewal_journey",
        },
    },

    [JOURNEY_TYPES.MTC]: {
        [PLATFORMS.ATHENA]: {
            [PRODUCTS.MOTOR]: "mtc_journey",
            [PRODUCTS.HOME]: "mtc_journey",
        },
        [PLATFORMS.PCW]: {
            [PRODUCTS.MOTOR]: "mtc_journey",
            [PRODUCTS.HOME]: "mtc_journey",
        },
        [PLATFORMS.PCW_TOOL]: {
            [PRODUCTS.MOTOR]: "mtc_journey",
            [PRODUCTS.HOME]: "mtc_journey",
        },
    },
} as const;

export function resolveSchemaSelection(args: {
    journeyContext: JourneyContext;
    platform: Platform;
    product: Product;
}): string | undefined {
    const byJourney = SCHEMA_SELECTION[args.journeyContext.type];
    const byPlatform = byJourney?.[args.platform];
    return byPlatform?.[args.product];
}
