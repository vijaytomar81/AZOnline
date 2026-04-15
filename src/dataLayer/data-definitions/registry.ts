// src/dataLayer/data-definitions/registry.ts

import { masterJourneySchema, pcwToolMessageSchema } from "./newBusiness";
// import { mtaJourneySchema } from "./mta";
// import { renewalJourneySchema } from "./renewal";
// import { mtcJourneySchema } from "./mtc";
import type { RegisteredSchema } from "./types";

export const dataDefinitionRegistry: Record<string, RegisteredSchema> = {
    new_business_journey: {
        name: "new_business_journey",
        schema: masterJourneySchema,
        description: "New business journey dataset.",
    },

    new_business_pcw_tool_message: {
        name: "new_business_pcw_tool_message",
        schema: pcwToolMessageSchema,
        description: "New business PCW tool message dataset.",
    },

    // mta_journey: {
    //     name: "mta_journey",
    //     schema: mtaJourneySchema,
    //     description: "MTA journey dataset.",
    // },
    // renewal_journey: {
    //     name: "renewal_journey",
    //     schema: renewalJourneySchema,
    //     description: "Renewal journey dataset.",
    // },
    // mtc_journey: {
    //     name: "mtc_journey",
    //     schema: mtcJourneySchema,
    //     description: "MTC journey dataset.",
    // },
};
