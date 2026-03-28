// src/execution/core/logging/e2eScenario/renderStepBlock.ts

import type { StepExecutionResult } from "@execution/core/result";
import { renderFields, safeText } from "@execution/core/logging/shared";
import { buildStepFields } from "./buildStepFields";
import { getTreeTokens } from "./getTreeTokens";

export function renderStepBlock(args: {
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
