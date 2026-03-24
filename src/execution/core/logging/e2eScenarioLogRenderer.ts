// src/execution/core/logging/e2eScenarioLogRenderer.ts

import { failure, success } from "@utils/cliFormat";
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
        lines.push(field("Duration", stepDuration(step)));

        const stepFields: Array<[string, unknown]> = [];

        if (step.stepNo === 1 && step.action === "NewBusiness") {
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

        lines.push(...renderFields(stepFields));
        lines.push("");
    }

    const failedStep = result.stepResults.find((item) => item.status === "failed");
    if (failedStep && failedStep.stepNo < scenario.totalSteps) {
        lines.push(failure("🚫 Scenario stopped after failed step"));
        lines.push("");
    }

    lines.push(field("ScenarioStatus", statusText(result.status)));
    lines.push(field("ScenarioTime", duration));
    lines.push("============================================================");

    return lines.join("\n");
}