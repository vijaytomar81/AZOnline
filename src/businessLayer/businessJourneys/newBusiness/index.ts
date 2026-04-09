// src/businessLayer/businessJourneys/newBusiness/index.ts

import { buildCalculatedEmail } from "@utils/calculatedEmail";
import { nowIso } from "@utils/time";
import { AppError } from "@utils/errors";
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
}): "Direct" | "PCW" | "PCWTool" {
    switch (args.platform) {
        case "PCW":
            return "PCW";
        case "PCWTool":
            return "PCWTool";
        default:
            return "Direct";
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

    const payload = (args.itemData ?? {}) as Record<string, unknown>;
    const startFrom = resolveStartFrom({
        platform: args.context.scenario.platform,
    });

    const quoteNumber = buildQuoteNumber();
    const policyNumber = buildPolicyNumber();
    const calculatedEmail = buildCalculatedEmail({
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
    setOutput(args, "newBusiness.payload", payload);

    args.context.currentQuoteNumber = quoteNumber;
    args.context.currentPolicyNumber = policyNumber;

    if (!args.context.scenario.policyNumber) {
        args.context.scenario.policyNumber = policyNumber;
    }
}
