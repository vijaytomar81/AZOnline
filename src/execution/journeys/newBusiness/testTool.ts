// src/execution/journeys/newBusiness/testTool.ts

import { nowIso } from "../../../utils/time";
import { setContextOutput, getContextOutput } from "../../runtime/executionContext";
import type { StepExecutorArgs } from "../../runtime/registry";

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

function getRequestMessage(stepData?: Record<string, unknown>): string {
    const testTool = (stepData?.testTool ?? {}) as Record<string, unknown>;
    return String(testTool.requestMessage ?? "").trim();
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

export async function runNewBusinessTestTool(
    args: StepExecutorArgs
): Promise<void> {
    const requestMessage = getRequestMessage(args.stepData);

    if (!requestMessage) {
        throw new Error("NewBusiness TestTool requestMessage is missing.");
    }

    const calculatedEmailId = getCalculatedEmailId(args);
    const finalRequestMessage = injectTokens(requestMessage, {
        CalculatedEmailId: calculatedEmailId,
    });

    setContextOutput(args.context, "lastAction", args.step.action);
    setContextOutput(args.context, "lastJourney", args.context.scenario.journey);
    setContextOutput(
        args.context,
        "newBusiness.testTool.calculatedEmailId",
        calculatedEmailId
    );
    setContextOutput(
        args.context,
        "newBusiness.testTool.requestMessage.raw",
        requestMessage
    );
    setContextOutput(
        args.context,
        "newBusiness.testTool.requestMessage.final",
        finalRequestMessage
    );
    setContextOutput(
        args.context,
        "newBusiness.testTool.payload",
        args.stepData ?? {}
    );
}