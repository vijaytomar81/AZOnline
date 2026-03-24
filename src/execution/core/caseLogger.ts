// src/execution/core/caseLogger.ts

import { failure, muted, success, warning } from "@utils/cliFormat";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { ScenarioExecutionResult, StepExecutionResult } from "./result";

type ExecutionMode = "data" | "e2e";

function headerLine(title: string): string {
    return `====================${title}====================`;
}

function divider(): string {
    return "------------------------------------------------------------";
}

function safeText(value: unknown): string {
    return String(value ?? "");
}

function field(label: string, value: unknown): string {
    return `${muted(label.padEnd(17))}: ${safeText(value)}`;
}

function statusText(status: string): string {
    if (status === "passed") return success("PASSED");
    if (status === "failed") return failure("FAILED");
    return warning(status.toUpperCase());
}

function stepDuration(step: StepExecutionResult): string {
    const start = new Date(step.startedAt).getTime();
    const end = new Date(step.finishedAt).getTime();
    if (Number.isNaN(start) || Number.isNaN(end)) return "0.00s";
    return `${((end - start) / 1000).toFixed(2)}s`;
}

export function formatDuration(startMs: number): string {
    return `${((Date.now() - startMs) / 1000).toFixed(2)}s`;
}

export function renderExecutionHeader(args: {
    mode: ExecutionMode;
    environment: string;
    iterations: number;
    parallel: number;
    schema?: string;
    source?: string;
    sheet?: string;
    totalCases?: number;
    totalScenarios?: number;
}): string {
    const lines: string[] = [];
    const title =
        args.mode === "data"
            ? success("[DATA-MODE EXECUTION]")
            : success("[E2E-MODE EXECUTION]");

    lines.push("");
    lines.push(headerLine(title));
    lines.push(field("Environment", args.environment));

    if (args.mode === "data") {
        lines.push(field("Schema", args.schema ?? ""));
        lines.push(field("Source", args.source ?? ""));
        lines.push(field("Total Cases", args.totalCases ?? 0));
    } else {
        lines.push(field("Sheet", args.sheet ?? ""));
        lines.push(field("Total Scenarios", args.totalScenarios ?? 0));
    }

    lines.push(field("Iterations", args.iterations));
    lines.push(field("Parallel", args.parallel));
    lines.push("==================================================");

    return lines.join("\n");
}

export function renderExecutionSummary(args: {
    total: number;
    passed: number;
    failed: number;
    totalTime: string;
}): string {
    const lines: string[] = [];

    lines.push("");
    lines.push("====================[SUMMARY]====================");
    lines.push(field("Total", args.total));
    lines.push(field("Passed", success(String(args.passed))));
    lines.push(field("Failed", args.failed > 0 ? failure(String(args.failed)) : success("0")));
    lines.push(field("Total Time", args.totalTime));
    lines.push("================================================");

    return lines.join("\n");
}

export function renderDataCaseBlock(args: {
    scenario: ExecutionScenario;
    result: ScenarioExecutionResult;
    duration: string;
}): string {
    const { scenario, result, duration } = args;
    const outputs = result.outputs ?? {};
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

    if (outputs["newBusiness.pcwTool.paymentMode"]) {
        lines.push(field("PaymentMode", outputs["newBusiness.pcwTool.paymentMode"]));
        lines.push(field("IQL", outputs["newBusiness.pcwTool.iql"] ?? ""));
        lines.push(
            field(
                "MonthlyCard",
                outputs["newBusiness.pcwTool.convertToMonthlyCard"] || "(blank)"
            )
        );
    }

    if (outputs["newBusiness.pcwTool.requestType"]) {
        lines.push(field("RequestType", outputs["newBusiness.pcwTool.requestType"]));
    }

    if (outputs["newBusiness.calculatedEmailId"]) {
        lines.push(field("CalculatedEmail", outputs["newBusiness.calculatedEmailId"]));
    }

    if (outputs["newBusiness.quoteNumber"]) {
        lines.push(field("QuoteNumber", outputs["newBusiness.quoteNumber"]));
    }

    if (outputs["newBusiness.policyNumber"]) {
        lines.push(field("PolicyNumber", outputs["newBusiness.policyNumber"]));
    }

    const failedStep = result.stepResults.find((item) => item.status === "failed");
    if (failedStep?.message) {
        lines.push(field("Error", failedStep.message));
    }

    lines.push("");
    lines.push(field("Status", statusText(result.status)));
    lines.push(field("Duration", muted(duration)));
    lines.push(divider());

    return lines.join("\n");
}

export function renderE2EScenarioBlock(args: {
    scenario: ExecutionScenario;
    result: ScenarioExecutionResult;
    duration: string;
}): string {
    const { scenario, result, duration } = args;
    const outputs = result.outputs ?? {};
    const lines: string[] = [];

    lines.push("");
    lines.push(
        `====================${success("[SCENARIO]")} ${scenario.scenarioId} | ${scenario.scenarioName}====================`
    );
    lines.push(`ScenarioId      : ${scenario.scenarioId}`);
    lines.push(`ScenarioName    : ${scenario.scenarioName}`);
    lines.push(`Journey         : ${scenario.journey}`);
    lines.push(`PolicyContext   : ${scenario.policyContext}`);
    lines.push(`EntryPoint      : ${scenario.entryPoint ?? "Direct"}`);
    lines.push(`Total Steps     : ${scenario.totalSteps}`);
    lines.push("");

    for (const step of result.stepResults) {
        const testCaseId = step.details?.testCaseId ?? "";
        lines.push("----------------------------------------");
        lines.push(`[STEP ${step.stepNo}] ${step.action} | TestCaseId=${testCaseId}`);
        lines.push("----------------------------------------");
        lines.push(field("Status", statusText(step.status)));
        lines.push(field("Duration", muted(stepDuration(step))));

        if (
            step.stepNo === 1 &&
            step.action === "NewBusiness" &&
            outputs["newBusiness.quoteNumber"]
        ) {
            lines.push(field("QuoteNumber", outputs["newBusiness.quoteNumber"]));
        }

        if (
            step.stepNo === 1 &&
            step.action === "NewBusiness" &&
            outputs["newBusiness.policyNumber"]
        ) {
            lines.push(field("PolicyNumber", outputs["newBusiness.policyNumber"]));
        }

        if (step.message) {
            lines.push(field("Error", step.message));
        }

        lines.push("");
    }

    const failedStep = result.stepResults.find((item) => item.status === "failed");
    if (failedStep && failedStep.stepNo < scenario.totalSteps) {
        lines.push(`${failure("🚫 Scenario stopped after failed step")}`);
        lines.push("");
    }

    lines.push(field("ScenarioStatus", statusText(result.status)));
    lines.push(field("ScenarioTime", muted(duration)));
    lines.push("============================================================");

    return lines.join("\n");
}