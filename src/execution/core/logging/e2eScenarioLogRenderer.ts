// src/execution/core/logging/e2eScenarioLogRenderer.ts

import { success } from "@utils/cliFormat";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type {
    ScenarioExecutionResult,
    StepExecutionResult,
} from "@execution/core/result";
import { OUTPUT_KEYS } from "@execution/constants/outputKeys";
import {
    collectFieldIfPresent,
    field,
    renderFields,
    safeText,
    statusText,
    stepDuration,
} from "@execution/core/logging/shared";

function getTreeTokens(index: number, total: number) {
    const isLast = index === total - 1;

    return {
        branch: isLast ? "└─" : "├─",
        indent: isLast ? "   " : "│  ",
    };
}

function getStepDebugLines(step: StepExecutionResult): string[] {
    const raw = step.details?.debugLines;

    if (!Array.isArray(raw)) {
        return [];
    }

    return raw.map((item) => safeText(item).trim()).filter(Boolean);
}

function shouldShowDebugLines(args: {
    verbose?: boolean;
    step: StepExecutionResult;
}): boolean {
    if (args.verbose) {
        return true;
    }

    return args.step.status === "failed";
}

function buildStepFields(args: {
    step: StepExecutionResult;
    outputs: Record<string, unknown>;
    verbose?: boolean;
}): Array<[string, unknown]> {
    const { step, outputs, verbose } = args;
    const stepFields: Array<[string, unknown]> = [];

    if (shouldShowDebugLines({ verbose, step })) {
        getStepDebugLines(step).forEach((debugLine) => {
            stepFields.push(["DEBUG", debugLine]);
        });
    }

    stepFields.push(["Status", statusText(step.status)]);
    stepFields.push(["Duration", stepDuration(step)]);

    if (step.action === "NewBusiness") {
        collectFieldIfPresent(
            stepFields,
            "CalculatedEmail",
            outputs[OUTPUT_KEYS.NEW_BUSINESS.CALCULATED_EMAIL]
        );
        collectFieldIfPresent(
            stepFields,
            "QuoteNumber",
            outputs[OUTPUT_KEYS.NEW_BUSINESS.QUOTE]
        );
        collectFieldIfPresent(
            stepFields,
            "PolicyNumber",
            outputs[OUTPUT_KEYS.NEW_BUSINESS.POLICY]
        );
    }

    if (step.message) {
        collectFieldIfPresent(stepFields, "Error", step.message);
    }

    return stepFields;
}

function renderStepBlock(args: {
    step: StepExecutionResult;
    index: number;
    total: number;
    outputs: Record<string, unknown>;
    verbose?: boolean;
}): string[] {
    const { step, index, total, outputs, verbose } = args;
    const { branch, indent } = getTreeTokens(index, total);
    const testCaseId = safeText(step.details?.testCaseId ?? "");
    const lines: string[] = [];

    lines.push(`${branch} [STEP ${step.stepNo}] ${step.action} | TestCaseId=${testCaseId}`);

    renderFields(
        buildStepFields({ step, outputs, verbose }),
        16
    ).forEach((line) => {
        lines.push(`${indent}${line}`);
    });

    if (index < total - 1) {
        lines.push(indent.trimEnd());
    }

    return lines;
}

export function renderE2EScenarioBlock(args: {
    scenario: ExecutionScenario;
    result: ScenarioExecutionResult;
    duration: string;
    verbose?: boolean;
}): string {
    const { scenario, result, duration, verbose } = args;
    const outputs = result.outputs ?? {};
    const lines: string[] = [];

    lines.push("");
    lines.push(
        `====================${success("[SCENARIO]")} ${scenario.scenarioId} | ${scenario.scenarioName}====================`
    );
    lines.push(field("ScenarioId", scenario.scenarioId));
    lines.push(field("ScenarioName", scenario.scenarioName));
    lines.push(field("Journey", scenario.journey));
    lines.push(field("PolicyContext", scenario.policyContext));
    lines.push(field("EntryPoint", scenario.entryPoint ?? "Direct"));
    lines.push(field("TotalSteps", scenario.totalSteps));
    lines.push("");

    result.stepResults.forEach((step, index) => {
        lines.push(
            ...renderStepBlock({
                step,
                index,
                total: result.stepResults.length,
                outputs,
                verbose,
            })
        );
    });

    lines.push("");
    lines.push(field("ScenarioStatus", statusText(result.status)));
    lines.push(field("ScenarioTime", duration));
    lines.push("============================================================");

    return lines.join("\n");
}