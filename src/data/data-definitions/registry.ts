// src/data/data-definitions/registry.ts

import { masterJourneySchema } from "./newBusiness";
import type { RegisteredSchema } from "./types";

export const dataDefinitionRegistry: Record<string, RegisteredSchema> = {
    master: {
        name: "master",
        schema: masterJourneySchema,
        description: "Base master journey definition for new business style datasets.",
    },

    direct: {
        name: "direct",
        schema: masterJourneySchema,
        description: "Direct new business dataset.",
    },

    cnf: {
        name: "cnf",
        schema: masterJourneySchema,
        description: "Confused new business dataset.",
    },

    ctm: {
        name: "ctm",
        schema: masterJourneySchema,
        description: "Compare The Market new business dataset.",
    },

    goco: {
        name: "goco",
        schema: masterJourneySchema,
        description: "GoCompare new business dataset.",
    },

    msm: {
        name: "msm",
        schema: masterJourneySchema,
        description: "MoneySuperMarket new business dataset.",
    },
};