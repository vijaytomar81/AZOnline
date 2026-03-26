// src/execution/journeys/mtc/index.ts

import { AppError } from "@utils/errors";
import type { StepExecutor } from "@execution/core/registry";

export const runMtc: StepExecutor = async ({ step }) => {
    throw new AppError({
        code: "MTC_HANDLER_NOT_IMPLEMENTED",
        stage: "execution-handler",
        source: "mtc-index",
        message: `MTC executor not implemented for subType="${step.subType ?? ""}".`,
        context: {
            subType: step.subType ?? "",
            action: step.action,
            testCaseId: step.testCaseId,
        },
    });
};