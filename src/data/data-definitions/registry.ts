// src/data/data-definitions/registry.ts

import { masterJourneySchema, pcwToolMessageSchema } from "./newBusiness";
import type { RegisteredSchema } from "./types";

export const dataDefinitionRegistry: Record<string, RegisteredSchema> = {
    master: {
        name: "master",
        schema: masterJourneySchema,
        description: "Base master journey definition for new business website datasets.",
    },

    direct: {
        name: "direct",
        schema: masterJourneySchema,
        description: "Direct new business website dataset.",
    },

    cnf: {
        name: "cnf",
        schema: masterJourneySchema,
        description: "Confused new business website dataset.",
    },

    ctm: {
        name: "ctm",
        schema: masterJourneySchema,
        description: "Compare The Market new business website dataset.",
    },

    goco: {
        name: "goco",
        schema: masterJourneySchema,
        description: "GoCompare new business website dataset.",
    },

    msm: {
        name: "msm",
        schema: masterJourneySchema,
        description: "MoneySuperMarket new business website dataset.",
    },

    cnf_pcw_testtool: {
        name: "cnf_pcw_testtool",
        schema: pcwToolMessageSchema,
        description: "Confused PCW TestTool dataset.",
    },

    ctm_pcw_testtool: {
        name: "ctm_pcw_testtool",
        schema: pcwToolMessageSchema,
        description: "Compare The Market PCW TestTool dataset.",
    },

    goco_pcw_testtool: {
        name: "goco_pcw_testtool",
        schema: pcwToolMessageSchema,
        description: "GoCompare PCW TestTool dataset.",
    },

    msm_pcw_testtool: {
        name: "msm_pcw_testtool",
        schema: pcwToolMessageSchema,
        description: "MoneySuperMarket PCW TestTool dataset.",
    },
};