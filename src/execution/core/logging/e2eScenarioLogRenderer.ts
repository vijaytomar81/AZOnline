// src/execution/core/logging/e2eScenarioLogRenderer.ts

import { success } from "@utils/cliFormat";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { ScenarioExecutionResult } from "@execution/core/result";
import { OUTPUT_KEYS } from "@execution/constants/outputKeys";
import {
    collectFieldIfPresent,
    field,
    renderFields,
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
    lines.push(`ScenarioId       : ${scenario.scenarioId}`);
    lines.push(`ScenarioName     : ${scenario.scenarioName}`);
    lines.push(`Journey          : ${scenario.journey}`);
    lines.push(`PolicyContext    : ${scenario.policyContext}`);
    lines.push(`EntryPoint       : ${scenario.entryPoint ?? "Direct"}`);
    lines.push(`Total Steps      : ${scenario.totalSteps}`);
    lines.push("");

    result.stepResults.forEach((step, index) => {
        const testCaseId = step.details?.testCaseId ?? "";
        const { branch, indent } = getTreeTokens(index, result.stepResults.length);

        lines.push(`${branch} [STEP ${step.stepNo}] ${step.action} | TestCaseId=${testCaseId}`);
        lines.push(`${indent}${field("Status", statusText(step.status)).trimStart()}`);
        lines.push(`${indent}${field("Duration", stepDuration(step)).trimStart()}`);

        const stepFields: Array<[string, unknown]> = [];

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

        renderFields(stepFields).forEach((line) => {
            lines.push(`${indent}${line}`);
        });

        if (index < result.stepResults.length - 1) {
            lines.push(indent.trimEnd());
        }
    });

    lines.push("");
    lines.push(field("ScenarioStatus", statusText(result.status)));
    lines.push(field("ScenarioTime", duration));
    lines.push("============================================================");

    return lines.join("\n");
}