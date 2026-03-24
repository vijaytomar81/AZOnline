// src/execution/journeys/newBusiness/pcwTool.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";
import { buildCalculatedEmail } from "@utils/calculatedEmail";
import {
    getContextOutput,
    setContextOutput,
} from "@execution/core/executionContext";
import { OUTPUT_KEYS } from "@execution/constants/outputKeys";
import type { StepExecutorArgs } from "@execution/core/registry";

function normalizeKey(value?: string): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
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
        OUTPUT_KEYS.NEW_BUSINESS.CALCULATED_EMAIL
    );

    if (existing) {
        return existing;
    }

    const generated = buildCalculatedEmail({
        testCaseId: args.step.testCaseId,
        startFrom: "pcwtool",
    });

    setContextOutput(
        args.context,
        OUTPUT_KEYS.NEW_BUSINESS.CALCULATED_EMAIL,
        generated
    );

    return generated;
}

function normalizeJourneyLabel(raw: string): string {
    const key = normalizeKey(raw);

    if (key === "ctm") return "CTM";
    if (key === "cnf") return "CNF";
    if (key === "msm") return "MSM";
    if (key === "goco") return "GoCo";

    return raw.trim();
}

function resolveJourney(stepData?: Record<string, unknown>): string {
    const pcwTool = getPcwToolData(stepData);
    const raw =
        normalizeSpaces(String(pcwTool.journey ?? "")) ||
        normalizeSpaces(String(pcwTool.pcwToolPortal ?? ""));

    if (!raw) {
        throw new AppError({
            code: "PCW_TOOL_JOURNEY_MISSING",
            stage: "execution-handler",
            source: "newBusiness-pcwTool",
            message: "Journey is required (MSM, CTM, CNF, GoCo).",
        });
    }

    const normalized = normalizeKey(raw);
    const allowed = ["msm", "ctm", "cnf", "goco"];

    if (!allowed.includes(normalized)) {
        throw new AppError({
            code: "PCW_TOOL_JOURNEY_UNSUPPORTED",
            stage: "execution-handler",
            source: "newBusiness-pcwTool",
            message: `Unsupported Journey "${raw}". Allowed values: MSM, CTM, CNF, GoCo.`,
            context: {
                journey: raw,
                allowed: allowed.join(", "),
            },
        });
    }

    return normalizeJourneyLabel(raw);
}

function detectRequestType(input: string): "XML" | "JSON" | "UNKNOWN" {
    const trimmed = input.trim();

    if (trimmed.startsWith("<")) return "XML";
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "JSON";

    return "UNKNOWN";
}

export async function runNewBusinessPcwTool(
    args: StepExecutorArgs
): Promise<void> {
    const pcwTool = getPcwToolData(args.stepData);

    const requestMessage = requireStringField(pcwTool, "requestMessage");
    const iql = requireStringField(pcwTool, "iql");
    const paymentMode = requireStringField(pcwTool, "paymentMode");
    const journey = resolveJourney(args.stepData);
    const convertToMonthlyCard = normalizeSpaces(
        String(pcwTool.convertToMonthlyCard ?? "")
    );

    const calculatedEmailId = getCalculatedEmailId(args);
    const finalRequestMessage = injectTokens(requestMessage, {
        CalculatedEmailId: calculatedEmailId,
    });

    setContextOutput(args.context, OUTPUT_KEYS.NEW_BUSINESS.LAST_ACTION, args.step.action);
    setContextOutput(args.context, OUTPUT_KEYS.NEW_BUSINESS.LAST_JOURNEY, journey);
    setContextOutput(args.context, OUTPUT_KEYS.NEW_BUSINESS.START_FROM, "PCWTool");
    setContextOutput(args.context, OUTPUT_KEYS.NEW_BUSINESS.JOURNEY, journey);
    setContextOutput(
        args.context,
        OUTPUT_KEYS.NEW_BUSINESS.CALCULATED_EMAIL,
        calculatedEmailId
    );
    setContextOutput(
        args.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.IQL,
        iql
    );
    setContextOutput(
        args.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.PAYMENT_MODE,
        paymentMode
    );
    setContextOutput(
        args.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.CONVERT_TO_MONTHLY_CARD,
        convertToMonthlyCard
    );
    setContextOutput(
        args.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.REQUEST_MESSAGE_RAW,
        requestMessage
    );
    setContextOutput(
        args.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.REQUEST_MESSAGE_FINAL,
        finalRequestMessage
    );
    setContextOutput(
        args.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.REQUEST_TYPE,
        detectRequestType(requestMessage)
    );
    setContextOutput(
        args.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.PAYLOAD,
        args.stepData ?? {}
    );
}