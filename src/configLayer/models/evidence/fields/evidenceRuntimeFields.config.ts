// src/configLayer/models/evidence/fields/evidenceRuntimeFields.config.ts

import type { EvidenceFieldDefinition } from "../types";

export const EVIDENCE_RUNTIME_FIELDS = {

    LAST_ACTION: { field: "LAST_ACTION", key: "lastAction", label: "Last Action", valueType: "string" },

    CALCULATED_EMAIL_ID: { field: "CALCULATED_EMAIL_ID", key: "calculatedEmailId", label: "Calculated Email ID", valueType: "string" },
    JOURNEY_START_WITH: { field: "JOURNEY_START_WITH", key: "journeyStartWith", label: "Journey Start With", valueType: "string" },
    POLICY_NUMBER: { field: "POLICY_NUMBER", key: "policyNumber", label: "Policy Number", valueType: "string" },
    QUOTE_NUMBER: { field: "QUOTE_NUMBER", key: "quoteNumber", label: "Quote Number", valueType: "string" },
    LOGIN_ID: { field: "LOGIN_ID", key: "loginId", label: "Login Id", valueType: "string" },
    OUTPUT_POLICY_NUMBER: { field: "OUTPUT_POLICY_NUMBER", key: "policyNumber", label: "Output Policy Number", valueType: "string" },
    OPENED_URL: { field: "OPENED_URL", key: "openedUrl", label: "Opened URL", valueType: "string" },
    PREMIUM: { field: "PREMIUM", key: "premium", label: "Premium", valueType: "string" },
    CALCULATED_EMAIL: { field: "CALCULATED_EMAIL", key: "calculatedEmail", label: "Calculated Email", valueType: "string" },

    PAYMENT_MODE: { field: "PAYMENT_MODE", key: "paymentMode", label: "Payment Mode", valueType: "string" },
    IQL: { field: "IQL", key: "iql", label: "IQL", valueType: "string" },
    CONVERT_TO_MONTHLY_CARD: { field: "CONVERT_TO_MONTHLY_CARD", key: "convertToMonthlyCard", label: "Convert To Monthly Card", valueType: "boolean" },
    REQUEST_TYPE: { field: "REQUEST_TYPE", key: "requestType", label: "Request Type", valueType: "string" },
    REQUEST_MESSAGE_RAW: { field: "REQUEST_MESSAGE_RAW", key: "requestMessageRaw", label: "Request Message Raw", valueType: "string" },
    REQUEST_MESSAGE_FINAL: { field: "REQUEST_MESSAGE_FINAL", key: "requestMessageFinal", label: "Request Message Final", valueType: "string" },

    PAGE_SCANS: { field: "PAGE_SCANS", key: "pageScans", label: "Page Scans", valueType: "json" },

    // =========================
    // Runtime Info
    // =========================
    RUNTIME_SYSTEM: { field: "RUNTIME_SYSTEM", key: "runtimeInfo.system", label: "Runtime System", valueType: "json" },
    RUNTIME_BROWSER: { field: "RUNTIME_BROWSER", key: "runtimeInfo.browser", label: "Runtime Browser", valueType: "json" },

} as const satisfies Record<string, EvidenceFieldDefinition>;
