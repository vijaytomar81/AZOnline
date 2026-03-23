// src/execution/journeys/newBusiness/handlers.ts

import { normalizeSpaces } from "../../../utils/text";
import { nowIso } from "../../../utils/time";
import { setContextOutput } from "../../runtime/executionContext";
import { resolveNewBusinessStartUrl } from "../../runtime/newBusinessUrlResolver";
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

async function openStartUrl(context: Parameters<NewBusinessHandler>[0]["context"]): Promise<string> {
    const page = context.page;
    if (!page) {
        throw new Error("Playwright page is not attached to execution context.");
    }

    const url = resolveNewBusinessStartUrl(context.scenario);
    await page.goto(url, { waitUntil: "domcontentloaded" });
    return url;
}

const runDirect: NewBusinessHandler = async ({
    context,
    step,
    stepData,
}) => {
    const payload = stepData ?? {};
    const quoteNumber = buildQuoteNumber();
    const policyNumber = buildPolicyNumber();
    const openedUrl = await openStartUrl(context);

    context.currentQuoteNumber = quoteNumber;
    context.currentPolicyNumber = policyNumber;

    setContextOutput(context, "lastAction", step.action);
    setContextOutput(context, "lastJourney", context.scenario.journey);
    setContextOutput(context, "newBusiness.startFrom", "Direct");
    setContextOutput(context, "newBusiness.openedUrl", openedUrl);
    setContextOutput(context, "newBusiness.quoteNumber", quoteNumber);
    setContextOutput(context, "newBusiness.policyNumber", policyNumber);
    setContextOutput(context, "newBusiness.payload", payload);

    if (!context.scenario.policyNumber) {
        context.scenario.policyNumber = policyNumber;
    }

    console.log(
        `[NB-SMOKE] scenario=${context.scenario.scenarioId} ` +
        `entryPoint=${context.scenario.entryPoint ?? "Direct"} ` +
        `journey=${context.scenario.journey} ` +
        `step=${step.stepNo} testCaseId=${step.testCaseId} url=${openedUrl}`
    );
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