// src/businessLayer/businessJourneys/newBusiness/index.ts
import { buildCalculatedEmail } from "@utils/calculatedEmail";
import { nowIso } from "@utils/time";
import { AppError } from "@utils/errors";
import { JOURNEY_START_SOURCES, type JourneyStartSource } from "@configLayer/domain/journeyEntryPoints";
import { OUTPUT_KEYS } from "@frameworkCore/executionLayer/constants/outputKeys";
import type { ExecutionItemExecutorArgs } from "@frameworkCore/executionLayer/core/registry";

function buildPolicyNumber(): string {
    const stamp = nowIso().replace(/[-:TZ.]/g, "").slice(0, 14);
    return `AUTO${stamp}`;
}

function buildQuoteNumber(): string {
    const stamp = nowIso().replace(/[-:TZ.]/g, "").slice(2, 14);
    return `Q${stamp}`;
}

function resolveStartFrom(args: {
    platform: string;
}): JourneyStartSource {
    switch (args.platform) {
        case JOURNEY_START_SOURCES.PCW:
            return JOURNEY_START_SOURCES.PCW;
        case JOURNEY_START_SOURCES.PCW_TOOL:
            return JOURNEY_START_SOURCES.PCW_TOOL;
        default:
            return JOURNEY_START_SOURCES.DIRECT;
    }
}

function setOutput(
    args: ExecutionItemExecutorArgs,
    key: string,
    value: unknown
): void {
    args.context.outputs[key] = value;
}

export async function runNewBusiness(
    args: ExecutionItemExecutorArgs
): Promise<void> {
    if (!args.context.page) {
        throw new AppError({
            code: "PAGE_MISSING",
            stage: "business-journey",
            source: "runNewBusiness",
            message: "Browser page is missing in execution context.",
        });
    }

    const startFrom = resolveStartFrom({
        platform: args.context.scenario.platform,
    });

    const quoteNumber = buildQuoteNumber();
    const policyNumber = buildPolicyNumber();
    const calculatedEmail = buildCalculatedEmail({
        envName: args.context.env.envName,
        testCaseId: args.item.testCaseRef,
        startFrom,
    });

    const openedUrl = args.context.page.url();

    setOutput(args, OUTPUT_KEYS.NEW_BUSINESS.LAST_ACTION, args.item.action);
    setOutput(args, OUTPUT_KEYS.NEW_BUSINESS.OPENED_URL, openedUrl);
    setOutput(
        args,
        OUTPUT_KEYS.NEW_BUSINESS.CALCULATED_EMAIL,
        calculatedEmail
    );
    setOutput(args, OUTPUT_KEYS.NEW_BUSINESS.QUOTE, quoteNumber);
    setOutput(args, OUTPUT_KEYS.NEW_BUSINESS.POLICY, policyNumber);

    args.context.currentQuoteNumber = quoteNumber;
    args.context.currentPolicyNumber = policyNumber;

    if (!args.context.scenario.policyNumber) {
        args.context.scenario.policyNumber = policyNumber;
    }
}