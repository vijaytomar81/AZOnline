// src/execution/journeys/newBusiness/handlers.ts

import { AppError } from "../../../utils/errors";
import { normalizeSpaces } from "../../../utils/text";
import { nowIso } from "../../../utils/time";
import { setContextOutput } from "../../runtime/executionContext";
import type { NewBusinessHandler, NewBusinessStartFrom } from "./types";
import { runNewBusinessPcwTool } from "./pcwTool";

const SMOKE_URL = "https://www.google.com";

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

async function openSmokeUrl(
    context: Parameters<NewBusinessHandler>[0]["context"]
): Promise<string> {
    const page = context.page;
    if (!page) {
        throw new AppError({
            code: "PLAYWRIGHT_PAGE_MISSING",
            stage: "execution-handler",
            source: "newBusiness-handlers",
            message: "Playwright page is not attached to execution context.",
            context: {
                scenarioId: context.scenario.scenarioId,
                entryPoint: context.scenario.entryPoint ?? "",
                journey: context.scenario.journey,
            },
        });
    }

    await page.goto(SMOKE_URL, { waitUntil: "domcontentloaded" });
    return SMOKE_URL;
}

const runDirect: NewBusinessHandler = async ({
    context,
    step,
    stepData,
}) => {
    const payload = stepData ?? {};
    const quoteNumber = buildQuoteNumber();
    const policyNumber = buildPolicyNumber();
    const openedUrl = await openSmokeUrl(context);

    context.currentQuoteNumber = quoteNumber;
    context.currentPolicyNumber = policyNumber;

    setContextOutput(context, "lastAction", step.action);
    setContextOutput(context, "lastJourney", context.scenario.journey);
    setContextOutput(context, "newBusiness.startFrom", context.scenario.entryPoint ?? "Direct");
    setContextOutput(context, "newBusiness.openedUrl", openedUrl);
    setContextOutput(context, "newBusiness.quoteNumber", quoteNumber);
    setContextOutput(context, "newBusiness.policyNumber", policyNumber);
    setContextOutput(context, "newBusiness.payload", payload);

    if (!context.scenario.policyNumber) {
        context.scenario.policyNumber = policyNumber;
    }

    console.log("========================================");
    console.log("[NB-SMOKE] NewBusiness step executed");
    console.log(`ScenarioId      : ${context.scenario.scenarioId}`);
    console.log(`ScenarioName    : ${context.scenario.scenarioName}`);
    console.log(`Journey         : ${context.scenario.journey}`);
    console.log(`PolicyContext   : ${context.scenario.policyContext}`);
    console.log(`EntryPoint      : ${context.scenario.entryPoint ?? "Direct"}`);
    console.log(`StepNo          : ${step.stepNo}`);
    console.log(`Action          : ${step.action}`);
    console.log(`TestCaseId      : ${step.testCaseId}`);
    console.log(`OpenedUrl       : ${openedUrl}`);
    console.log(`QuoteNumber     : ${quoteNumber}`);
    console.log(`PolicyNumber    : ${policyNumber}`);
    console.log(`PayloadKeys     : ${Object.keys(payload).join(", ")}`);
    console.log("========================================");
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