// src/executionLayer/constants/outputKeys.ts

export const OUTPUT_KEYS = {
    NEW_BUSINESS: {
        START_FROM: "newBusiness.startFrom",
        JOURNEY: "newBusiness.journey",
        PAYLOAD: "newBusiness.payload",
        CALCULATED_EMAIL: "newBusiness.calculatedEmailId",
        QUOTE: "newBusiness.quoteNumber",
        POLICY: "newBusiness.policyNumber",
        OPENED_URL: "newBusiness.openedUrl",
        LAST_ACTION: "lastAction",
        LAST_JOURNEY: "lastJourney",
        PCW_TOOL: {
            IQL: "newBusiness.pcwTool.iql",
            PAYMENT_MODE: "newBusiness.pcwTool.paymentMode",
            CONVERT_TO_MONTHLY_CARD: "newBusiness.pcwTool.convertToMonthlyCard",
            REQUEST_TYPE: "newBusiness.pcwTool.requestType",
            REQUEST_MESSAGE_RAW: "newBusiness.pcwTool.requestMessage.raw",
            REQUEST_MESSAGE_FINAL: "newBusiness.pcwTool.requestMessage.final",
            PAYLOAD: "newBusiness.pcwTool.payload",
        },
    },
} as const;