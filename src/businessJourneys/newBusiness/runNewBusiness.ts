// src/businessJourneys/newBusiness/runNewBusiness.ts

import { buildCalculatedEmail } from "@utils/calculatedEmail";
import { nowIso } from "@utils/time";
import { OUTPUT_KEYS } from "@executionLayer/constants/outputKeys";
import { setContextOutput } from "@executionLayer/core/context";
import type { BusinessJourneyExecutor } from "@businessJourneys/shared";
import { captureBusinessOutputs } from "./captureBusinessOutputs";

function buildPolicyNumber(): string {
    const stamp = nowIso().replace(/[-:TZ.]/g, "").slice(0, 14);
    return `AUTO${stamp}`;
}

function buildQuoteNumber(): string {
    const stamp = nowIso().replace(/[-:TZ.]/g, "").slice(2, 14);
    return `Q${stamp}`;
}

export const runNewBusiness: BusinessJourneyExecutor = async ({
    context,
    item,
    itemData,
}) => {
    const payload = itemData ?? {};
    const scenarioJourney = context.scenario.journey || "Direct";
    const entryPoint = context.scenario.entryPoint ?? "Direct";

    const quoteNumber = buildQuoteNumber();
    const policyNumber = buildPolicyNumber();
    const calculatedEmail = buildCalculatedEmail({
        testCaseId: item.testCaseRef,
        startFrom: entryPoint,
    });

    setContextOutput(
        context,
        OUTPUT_KEYS.NEW_BUSINESS.LAST_ACTION,
        item.action
    );
    setContextOutput(
        context,
        OUTPUT_KEYS.NEW_BUSINESS.START_FROM,
        entryPoint
    );

    captureBusinessOutputs({
        context,
        values: {
            quoteNumber,
            policyNumber,
            calculatedEmail,
            journey: scenarioJourney,
            payload,
        },
    });

    if (!context.scenario.policyNumber) {
        context.scenario.policyNumber = policyNumber;
    }
};
