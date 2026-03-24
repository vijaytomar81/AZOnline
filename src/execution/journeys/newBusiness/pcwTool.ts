// src/execution/journeys/newBusiness/pcwTool.ts

import { AppError } from "@utils/errors";
import { nowIso } from "@utils/time";
import { normalizeSpaces } from "@utils/text";
import {
    getContextOutput,
    setContextOutput,
} from "@execution/core/executionContext";
import type { StepExecutorArgs } from "@execution/core/registry";

const SMOKE_URL = "https://www.google.com";

function normalizeKey(value?: string): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

function buildCalculatedEmailId(): string {
    const stamp = nowIso().replace(/[-:TZ.]/g, "").slice(0, 14);
    return `autotest_${stamp}@example.com`;
}

function injectTokens(input: string, tokens: Record<string, string>): string {
    let output = input;

    Object.entries(tokens).forEach(([key, value]) => {
        const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "gi");
        output = output.replace(pattern, value);
    });

    return output;
}

function getPcwToolData(stepData?: Record<string, unknown>): Record<string, unknown> {
    return (stepData?.pcwTool ?? {}) as Record<string, unknown>;
}

function requireStringField(
    source: Record<string, unknown>,
    fieldName: string
): string {
    const value = normalizeSpaces(String(source[fieldName] ?? ""));
    if (!value) {
        throw new AppError({
            code: "PCW_TOOL_FIELD_MISSING",
            stage: "execution-handler",
            source: "newBusiness-pcwTool",
            message: `PCW Tool field "${fieldName}" is missing.`,
            context: { fieldName },
        });
    }
    return value;
}

function getCalculatedEmailId(args: StepExecutorArgs): string {
    const existing = getContextOutput<string>(
        args.context,
        "newBusiness.calculatedEmailId"
    );

    if (existing) {
        return existing;
    }

    const generated = buildCalculatedEmailId();
    setContextOutput(args.context, "newBusiness.calculatedEmailId", generated);
    return generated;
}

function validatePcwToolPortal(portal: string): string {
    const normalized = normalizeKey(portal);
    const allowed = ["msm", "ctm", "cnf", "goco"];

    if (!allowed.includes(normalized)) {
        throw new AppError({
            code: "PCW_TOOL_PORTAL_UNSUPPORTED",
            stage: "execution-handler",
            source: "newBusiness-pcwTool",
            message: `Unsupported PCW Tool Portal "${portal}". Allowed values: MSM, CTM, CNF, GoCo.`,
            context: {
                portal,
                allowed: allowed.join(", "),
            },
        });
    }

    return normalized;
}

export async function runNewBusinessPcwTool(
    args: StepExecutorArgs
): Promise<void> {
    const page = args.context.page;
    if (!page) {
        throw new AppError({
            code: "PLAYWRIGHT_PAGE_MISSING",
            stage: "execution-handler",
            source: "newBusiness-pcwTool",
            message: "Playwright page is not attached to execution context.",
            context: {
                scenarioId: args.context.scenario.scenarioId,
                stepNo: args.step.stepNo,
                action: args.step.action,
            },
        });
    }

    const pcwTool = getPcwToolData(args.stepData);
    const requestMessage = requireStringField(pcwTool, "requestMessage");
    const iql = requireStringField(pcwTool, "iql");
    const pcwToolPortalRaw = requireStringField(pcwTool, "pcwToolPortal");
    const paymentMode = requireStringField(pcwTool, "paymentMode");
    const convertToMonthlyCard = normalizeSpaces(
        String(pcwTool.convertToMonthlyCard ?? "")
    );

    const pcwToolPortal = validatePcwToolPortal(pcwToolPortalRaw);
    const calculatedEmailId = getCalculatedEmailId(args);
    const finalRequestMessage = injectTokens(requestMessage, {
        CalculatedEmailId: calculatedEmailId,
    });

    await page.goto(SMOKE_URL, { waitUntil: "domcontentloaded" });

    setContextOutput(args.context, "lastAction", args.step.action);
    setContextOutput(args.context, "lastJourney", args.context.scenario.journey);
    setContextOutput(args.context, "newBusiness.startFrom", "PCWTool");
    setContextOutput(args.context, "newBusiness.openedUrl", SMOKE_URL);
    setContextOutput(args.context, "newBusiness.calculatedEmailId", calculatedEmailId);
    setContextOutput(args.context, "newBusiness.pcwTool.portal", pcwToolPortal);
    setContextOutput(args.context, "newBusiness.pcwTool.iql", iql);
    setContextOutput(args.context, "newBusiness.pcwTool.paymentMode", paymentMode);
    setContextOutput(
        args.context,
        "newBusiness.pcwTool.convertToMonthlyCard",
        convertToMonthlyCard
    );
    setContextOutput(args.context, "newBusiness.pcwTool.requestMessage.raw", requestMessage);
    setContextOutput(args.context, "newBusiness.pcwTool.requestMessage.final", finalRequestMessage);
    setContextOutput(args.context, "newBusiness.pcwTool.payload", args.stepData ?? {});

    console.log(`StepNo          : ${args.step.stepNo}`);
    console.log(`Action          : ${args.step.action}`);
    console.log(`TestCaseId      : ${args.step.testCaseId}`);
    console.log(`OpenedUrl       : ${SMOKE_URL}`);
    console.log(`PcwToolPortal   : ${pcwToolPortal}`);
    console.log(`PaymentMode     : ${paymentMode}`);
    console.log(`IQL             : ${iql}`);
    console.log(`MonthlyCard     : ${convertToMonthlyCard || "(blank)"}`);
    console.log(`CalculatedEmail : ${calculatedEmailId}`);
    console.log(`RequestPreview  : ${finalRequestMessage.slice(0, 200)}`);
}