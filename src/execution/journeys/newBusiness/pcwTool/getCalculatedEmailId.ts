// src/execution/journeys/newBusiness/pcwTool/getCalculatedEmailId.ts

import { buildCalculatedEmail } from "@utils/calculatedEmail";
import { OUTPUT_KEYS } from "@execution/constants/outputKeys";
import {
    getContextOutput,
    setContextOutput,
} from "@execution/core/executionContext";
import type { StepExecutorArgs } from "@execution/core/registry";

export function getCalculatedEmailId(
    args: StepExecutorArgs
): string {
    const existing = getContextOutput<string>(
        args.context,
        OUTPUT_KEYS.NEW_BUSINESS.CALCULATED_EMAIL
    );

    if (existing) {
        return existing;
    }

    const generated = buildCalculatedEmail({
        testCaseId: args.step.testCaseId,
        startFrom: "pcwtool",
    });

    setContextOutput(
        args.context,
        OUTPUT_KEYS.NEW_BUSINESS.CALCULATED_EMAIL,
        generated
    );

    return generated;
}
