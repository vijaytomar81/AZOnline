// src/execution/journeys/newBusiness/pcwTool.ts

import { AppError } from "@utils/errors";
import { nowIso } from "@utils/time";
import { normalizeSpaces } from "@utils/text";
import {
    getContextOutput,
    setContextOutput,
} from "@execution/core/executionContext";
import type { StepExecutorArgs } from "@execution/core/registry";

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

    setContextOutput(args.context, "lastAction", args.step.action);
    setContextOutput(args.context, "lastJourney", journey);
    setContextOutput(args.context, "newBusiness.startFrom", "PCWTool");
    setContextOutput(args.context, "newBusiness.journey", journey);
    setContextOutput(args.context, "newBusiness.calculatedEmailId", calculatedEmailId);
    setContextOutput(args.context, "newBusiness.pcwTool.iql", iql);
    setContextOutput(args.context, "newBusiness.pcwTool.paymentMode", paymentMode);
    setContextOutput(
        args.context,
        "newBusiness.pcwTool.convertToMonthlyCard",
        convertToMonthlyCard
    );
    setContextOutput(
        args.context,
        "newBusiness.pcwTool.requestMessage.raw",
        requestMessage
    );
    setContextOutput(
        args.context,
        "newBusiness.pcwTool.requestMessage.final",
        finalRequestMessage
    );
    setContextOutput(
        args.context,
        "newBusiness.pcwTool.requestType",
        detectRequestType(requestMessage)
    );
    setContextOutput(
        args.context,
        "newBusiness.pcwTool.payload",
        args.stepData ?? {}
    );
}