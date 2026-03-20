// src/execution/journeys/newBusiness/handlers.ts

import { normalizeSpaces } from "../../../utils/text";
import { nowIso } from "../../../utils/time";
import { setContextOutput } from "../../runtime/executionContext";
import type { NewBusinessHandler } from "./types";

function normalizeKey(value?: string): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

function buildPolicyNumber(): string {
    const stamp = nowIso().replace(/[-:TZ.]/g, "").slice(0, 14);
    return `AUTO${stamp}`;
}

function buildQuoteNumber(): string {
    const stamp = nowIso().replace(/[-:TZ.]/g, "").slice(2, 14);
    return `Q${stamp}`;
}

const runDirect: NewBusinessHandler = async ({
    context,
    step,
    stepData,
}) => {
    const payload = stepData ?? {};
    const quoteNumber = buildQuoteNumber();
    const policyNumber = buildPolicyNumber();

    context.currentQuoteNumber = quoteNumber;
    context.currentPolicyNumber = policyNumber;

    setContextOutput(context, "lastAction", step.action);
    setContextOutput(context, "lastJourney", context.scenario.journey);
    setContextOutput(context, "newBusiness.quoteNumber", quoteNumber);
    setContextOutput(context, "newBusiness.policyNumber", policyNumber);
    setContextOutput(context, "newBusiness.payload", payload);

    if (!context.scenario.policyNumber) {
        context.scenario.policyNumber = policyNumber;
    }
};

const runFallback: NewBusinessHandler = async (args) => {
    await runDirect(args);
};

export const newBusinessHandlers: Record<string, NewBusinessHandler> = {
    direct: runDirect,
    confused: runFallback,
    comparethemarket: runFallback,
    gocompare: runFallback,
    moneysupermarket: runFallback,
};

export function getNewBusinessHandler(journey?: string): NewBusinessHandler {
    const key = normalizeKey(journey);
    return newBusinessHandlers[key] ?? runFallback;
}