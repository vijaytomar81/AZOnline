// src/execution/core/logging/e2eScenario/buildStepFields.ts

import type { StepExecutionResult } from "@execution/core/result";
import { OUTPUT_KEYS } from "@execution/constants/outputKeys";
import {
    collectFieldIfPresent,
    statusText,
    stepDuration,
} from "@execution/core/logging/shared";
import { getStepDebugLines } from "./getStepDebugLines";
import { shouldShowStepDebugLines } from "./shouldShowStepDebugLines";

export function buildStepFields(args: {
    step: StepExecutionResult;
    outputs: Record<string, unknown>;
    verbose?: boolean;
}): Array<[string, unknown]> {
    const { step, outputs, verbose } = args;
    const stepFields: Array<[string, unknown]> = [];

    if (shouldShowStepDebugLines({ verbose, step })) {
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
