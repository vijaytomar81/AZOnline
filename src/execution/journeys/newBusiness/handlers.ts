// src/execution/journeys/newBusiness/handlers.ts

import { normalizeSpaces } from "@utils/text";
import { nowIso } from "@utils/time";
import { setContextOutput } from "@execution/core/executionContext";
import type { NewBusinessHandler, NewBusinessStartFrom } from "./types";
import { runNewBusinessPcwTool } from "./pcwTool";

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
    setContextOutput(context, "lastJourney", context.scenario.journey || "Direct");
    setContextOutput(
        context,
        "newBusiness.startFrom",
        context.scenario.entryPoint ?? "Direct"
    );
    setContextOutput(context, "newBusiness.quoteNumber", quoteNumber);
    setContextOutput(context, "newBusiness.policyNumber", policyNumber);
    setContextOutput(context, "newBusiness.payload", payload);

    if (!context.scenario.policyNumber) {
        context.scenario.policyNumber = policyNumber;
    }
};

const runPcw: NewBusinessHandler = async (args) => {
    await runDirect(args);
};

const startFromHandlers: Record<NewBusinessStartFrom, NewBusinessHandler> = {
    Direct: runDirect,
    PCW: runPcw,
    PCWTool: runNewBusinessPcwTool,
};

function resolveStartFrom(
    journey?: string,
    entryPoint?: string
): NewBusinessStartFrom {
    const normalizedJourney = normalizeKey(journey);
    const normalizedEntryPoint = normalizeKey(entryPoint);

    if (normalizedEntryPoint === "pcwtool") return "PCWTool";
    if (normalizedEntryPoint === "pcw") return "PCW";
    if (normalizedJourney === "direct") return "Direct";
    return "PCW";
}

export function getNewBusinessHandler(args: {
    journey?: string;
    entryPoint?: string;
}): NewBusinessHandler {
    const startFrom = resolveStartFrom(args.journey, args.entryPoint);
    return startFromHandlers[startFrom];
}