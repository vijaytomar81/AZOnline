// src/data/data-definitions/registry.ts

import { masterJourneySchema, pcwToolMessageSchema } from "./newBusiness";
import type { RegisteredSchema } from "./types";

export const dataDefinitionRegistry: Record<string, RegisteredSchema> = {
    master: {
        name: "master",
        schema: masterJourneySchema,
        description: "Base master journey definition for new business website datasets.",
        sheetAliases: ["Master_Template", "Master"],
    },

    direct: {
        name: "direct",
        schema: masterJourneySchema,
        description: "Direct new business website dataset.",
        sheetAliases: [
            "Direct",
            "FlowNB",
            "FerryNB",
            "FerryDriveAwayPlusAnnual",
            "FerryDriveAwayAnnualNB",
            "FerryDriveAwayOnlyNB",
            "AgentPortal_DriveAwayPlusAnnual",
            "AgentPortal_DriveAwayOnly",
            "AgentPortal_Annual",
            "Motor_MultiPolicy",
        ],
    },

    cnf: {
        name: "cnf",
        schema: masterJourneySchema,
        description: "Confused new business website dataset.",
        sheetAliases: ["CNF"],
    },

    ctm: {
        name: "ctm",
        schema: masterJourneySchema,
        description: "Compare The Market new business website dataset.",
        sheetAliases: ["CTM"],
    },

    goco: {
        name: "goco",
        schema: masterJourneySchema,
        description: "GoCompare new business website dataset.",
        sheetAliases: ["GoCo"],
    },

    msm: {
        name: "msm",
        schema: masterJourneySchema,
        description: "MoneySuperMarket new business website dataset.",
        sheetAliases: ["MSM"],
    },

    cnf_pcw_tool: {
        name: "cnf_pcw_tool",
        schema: pcwToolMessageSchema,
        description: "Confused PCW Tool dataset.",
        sheetAliases: ["CNF PCW Tool"],
    },

    ctm_pcw_tool: {
        name: "ctm_pcw_tool",
        schema: pcwToolMessageSchema,
        description: "Compare The Market PCW Tool dataset.",
        sheetAliases: ["CTM PCW Tool"],
    },

    goco_pcw_tool: {
        name: "goco_pcw_tool",
        schema: pcwToolMessageSchema,
        description: "GoCompare PCW Tool dataset.",
        sheetAliases: ["GoCo PCW Tool"],
    },

    msm_pcw_tool: {
        name: "msm_pcw_tool",
        schema: pcwToolMessageSchema,
        description: "MoneySuperMarket PCW Tool dataset.",
        sheetAliases: ["MSM PCW Tool"],
    },

    pcw_tool: {
        name: "pcw_tool",
        schema: pcwToolMessageSchema,
        description: "Shared PCW Tool new business dataset.",
        sheetAliases: ["PCW Tool"],
    },
};