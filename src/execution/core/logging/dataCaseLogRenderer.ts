// src/execution/core/logging/dataCaseLogRenderer.ts

import { muted, success } from "@utils/cliFormat";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { ScenarioExecutionResult } from "@execution/core/result";
import {
    collectFieldIfPresent,
    divider,
    field,
    renderFields,
    statusText,
} from "@execution/core/logging/shared";

function formatRequestPreview(value: unknown): string {
    const text = String(value ?? "").trim();
    if (!text) return "";

    // 👉 Keep logs clean (avoid dumping huge payloads)
    const maxLength = 100;
    return text.length > maxLength
        ? `${text.slice(0, maxLength)}...`
        : text;
}

export function renderDataCaseBlock(args: {
    scenario: ExecutionScenario;
    result: ScenarioExecutionResult;
    duration: string;
}): string {
    const { scenario, result, duration } = args;
    const outputs = result.outputs ?? {};
    const failedStep = result.stepResults.find((item) => item.status === "failed");

    const lines: string[] = [];

    // ================= HEADER =================
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

    // ================= DETAILS =================
    const detailFields: Array<[string, unknown]> = [];

    collectFieldIfPresent(
        detailFields,
        "PaymentMode",
        outputs["newBusiness.pcwTool.paymentMode"]
    );

    collectFieldIfPresent(
        detailFields,
        "IQL",
        outputs["newBusiness.pcwTool.iql"]
    );

    const monthlyCard =
        outputs["newBusiness.pcwTool.paymentMode"] !== undefined
            ? outputs["newBusiness.pcwTool.convertToMonthlyCard"] || "(blank)"
            : undefined;

    collectFieldIfPresent(detailFields, "Monthly Card", monthlyCard);

    collectFieldIfPresent(
        detailFields,
        "RequestType",
        outputs["newBusiness.pcwTool.requestType"]
    );

    // 🔥 NEW → RequestMessage (preview)
    const requestMessage = outputs["newBusiness.pcwTool.requestMessage.final"];
    collectFieldIfPresent(
        detailFields,
        "RequestMessage",
        formatRequestPreview(requestMessage)
    );

    collectFieldIfPresent(
        detailFields,
        "CalculatedEmail",
        outputs["newBusiness.calculatedEmailId"]
    );

    collectFieldIfPresent(
        detailFields,
        "QuoteNumber",
        outputs["newBusiness.quoteNumber"]
    );

    collectFieldIfPresent(
        detailFields,
        "PolicyNumber",
        outputs["newBusiness.policyNumber"]
    );

    if (failedStep?.message) {
        collectFieldIfPresent(detailFields, "Error", failedStep.message);
    }

    lines.push(...renderFields(detailFields));

    // ================= FOOTER =================
    lines.push("");
    lines.push(field("Status", statusText(result.status)));
    lines.push(field("Duration", duration));
    lines.push(divider());

    return lines.join("\n");
}