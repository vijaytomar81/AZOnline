// src/execution/journeys/newBusiness/core/runDirectNewBusiness.ts

import { buildCalculatedEmail } from "@utils/calculatedEmail";
import { OUTPUT_KEYS } from "@execution/constants/outputKeys";
import { setContextOutput } from "@execution/core/executionContext";
import type { NewBusinessHandler } from "./types";
import { buildPolicyNumber } from "./buildPolicyNumber";
import { buildQuoteNumber } from "./buildQuoteNumber";

export const runDirectNewBusiness: NewBusinessHandler = async ({
    context,
    step,
    stepData,
}) => {
    const payload = stepData ?? {};
    const quoteNumber = buildQuoteNumber();
    const policyNumber = buildPolicyNumber();

    const calculatedEmail = buildCalculatedEmail({
        testCaseId: step.testCaseId,
        startFrom: context.scenario.entryPoint ?? "direct",
    });

    context.currentQuoteNumber = quoteNumber;
    context.currentPolicyNumber = policyNumber;

    setContextOutput(context, OUTPUT_KEYS.NEW_BUSINESS.LAST_ACTION, step.action);
    setContextOutput(
        context,
        OUTPUT_KEYS.NEW_BUSINESS.LAST_JOURNEY,
        context.scenario.journey || "Direct"
    );
    setContextOutput(
        context,
        OUTPUT_KEYS.NEW_BUSINESS.START_FROM,
        context.scenario.entryPoint ?? "Direct"
    );
    setContextOutput(context, OUTPUT_KEYS.NEW_BUSINESS.QUOTE, quoteNumber);
    setContextOutput(context, OUTPUT_KEYS.NEW_BUSINESS.POLICY, policyNumber);
    setContextOutput(context, OUTPUT_KEYS.NEW_BUSINESS.PAYLOAD, payload);
    setContextOutput(
        context,
        OUTPUT_KEYS.NEW_BUSINESS.CALCULATED_EMAIL,
        calculatedEmail
    );

    if (!context.scenario.policyNumber) {
        context.scenario.policyNumber = policyNumber;
    }
};
