// src/businessJourneys/newBusiness/captureBusinessOutputs.ts

import { OUTPUT_KEYS } from "@executionLayer/constants/outputKeys";
import { setContextOutput } from "@executionLayer/core/context";
import type { CaptureBusinessOutputsArgs } from "./types";

export function captureBusinessOutputs(
    args: CaptureBusinessOutputsArgs
): void {
    const { context, values } = args;

    if (values.quoteNumber) {
        context.currentQuoteNumber = values.quoteNumber;
        setContextOutput(
            context,
            OUTPUT_KEYS.NEW_BUSINESS.QUOTE,
            values.quoteNumber
        );
    }

    if (values.policyNumber) {
        context.currentPolicyNumber = values.policyNumber;
        setContextOutput(
            context,
            OUTPUT_KEYS.NEW_BUSINESS.POLICY,
            values.policyNumber
        );
    }

    if (values.premium) {
        setContextOutput(
            context,
            OUTPUT_KEYS.NEW_BUSINESS.PREMIUM,
            values.premium
        );
    }

    if (values.paymentMode) {
        setContextOutput(
            context,
            OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.PAYMENT_MODE,
            values.paymentMode
        );
    }

    if (values.requestType) {
        setContextOutput(
            context,
            OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.REQUEST_TYPE,
            values.requestType
        );
    }

    if (values.calculatedEmail) {
        setContextOutput(
            context,
            OUTPUT_KEYS.NEW_BUSINESS.CALCULATED_EMAIL,
            values.calculatedEmail
        );
    }

    if (values.journey) {
        setContextOutput(
            context,
            OUTPUT_KEYS.NEW_BUSINESS.JOURNEY,
            values.journey
        );
        setContextOutput(
            context,
            OUTPUT_KEYS.NEW_BUSINESS.LAST_JOURNEY,
            values.journey
        );
    }

    if (values.payload) {
        setContextOutput(
            context,
            OUTPUT_KEYS.NEW_BUSINESS.PAYLOAD,
            values.payload
        );
    }
}
