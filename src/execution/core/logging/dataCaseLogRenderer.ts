// src/execution/core/logging/dataCaseLogRenderer.ts

import { muted, success } from "@utils/cliFormat";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type {
    ScenarioExecutionResult,
    StepExecutionResult,
} from "@execution/core/result";
import { OUTPUT_KEYS } from "@execution/constants/outputKeys";
import {
    collectFieldIfPresent,
    divider,
    field,
    renderFields,
    safeText,
    statusText,
} from "@execution/core/logging/shared";

function formatRequestPreview(value: unknown): string {
    const text = String(value ?? "").trim();

    if (!text) {
        return "";
    }

    const maxLength = 100;
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function getDebugLines(step?: StepExecutionResult): string[] {
    const raw = step?.details?.debugLines;

    if (!Array.isArray(raw)) {
        return [];
    }

    return raw.map((item) => safeText(item).trim()).filter(Boolean);
}

function shouldShowDebugLines(args: {
    verbose?: boolean;
    result: ScenarioExecutionResult;
}): boolean {
    if (args.verbose) {
        return true;
    }

    return args.result.status === "failed";
}

export function renderDataCaseBlock(args: {
    scenario: ExecutionScenario;
    result: ScenarioExecutionResult;
    duration: string;
    verbose?: boolean;
}): string {
    const { scenario, result, duration, verbose } = args;
    const outputs = result.outputs ?? {};
    const step = result.stepResults[0];
    const failedStep = result.stepResults.find((item) => item.status === "failed");
    const lines: string[] = [];

    lines.push("");
    lines.push(
        `====================${muted("[DATA-CASE]")} ${success(
            scenario.scenarioId
        )}====================`
    );
    lines.push(field("TestCaseId", scenario.scenarioId));
    lines.push(field("Journey", scenario.journey));
    lines.push(field("EntryPoint", scenario.entryPoint ?? "Direct"));
    lines.push("");

    const detailFields: Array<[string, unknown]> = [];

    if (shouldShowDebugLines({ verbose, result })) {
        getDebugLines(step).forEach((debugLine) => {
            detailFields.push(["DEBUG", debugLine]);
        });
    }

    collectFieldIfPresent(
        detailFields,
        "PaymentMode",
        outputs[OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.PAYMENT_MODE]
    );
    collectFieldIfPresent(
        detailFields,
        "IQL",
        outputs[OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.IQL]
    );

    const monthlyCard =
        outputs[OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.PAYMENT_MODE] !== undefined
            ? outputs[OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.CONVERT_TO_MONTHLY_CARD] || "(blank)"
            : undefined;

    collectFieldIfPresent(detailFields, "Monthly Card", monthlyCard);
    collectFieldIfPresent(
        detailFields,
        "RequestType",
        outputs[OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.REQUEST_TYPE]
    );
    collectFieldIfPresent(
        detailFields,
        "RequestMessage",
        formatRequestPreview(
            outputs[OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.REQUEST_MESSAGE_FINAL]
        )
    );
    collectFieldIfPresent(
        detailFields,
        "CalculatedEmail",
        outputs[OUTPUT_KEYS.NEW_BUSINESS.CALCULATED_EMAIL]
    );
    collectFieldIfPresent(
        detailFields,
        "QuoteNumber",
        outputs[OUTPUT_KEYS.NEW_BUSINESS.QUOTE]
    );
    collectFieldIfPresent(
        detailFields,
        "PolicyNumber",
        outputs[OUTPUT_KEYS.NEW_BUSINESS.POLICY]
    );

    if (failedStep?.message) {
        collectFieldIfPresent(detailFields, "Error", failedStep.message);
    }

    lines.push(...renderFields(detailFields, 16));
    lines.push("");
    lines.push(field("Status", statusText(result.status)));
    lines.push(field("Duration", duration));
    lines.push(divider());

    return lines.join("\n");
}