// src/frameworkCore/executionLayer/constants/outputKeys.ts

export const OUTPUT_KEYS = {
    NEW_BUSINESS: {
        CALCULATED_EMAIL: "newBusiness.calculatedEmailId",
        QUOTE: "newBusiness.quoteNumber",
        POLICY: "newBusiness.policyNumber",
        PREMIUM: "newBusiness.premium",
        OPENED_URL: "newBusiness.openedUrl",
        LAST_ACTION: "lastAction",
        PCW_TOOL: {
            IQL: "newBusiness.pcwTool.iql",
            PAYMENT_MODE: "newBusiness.pcwTool.paymentMode",
            CONVERT_TO_MONTHLY_CARD: "newBusiness.pcwTool.convertToMonthlyCard",
            REQUEST_TYPE: "newBusiness.pcwTool.requestType",
            REQUEST_MESSAGE_RAW: "newBusiness.pcwTool.requestMessage.raw",
            REQUEST_MESSAGE_FINAL: "newBusiness.pcwTool.requestMessage.final",
        },
    },
} as const;