// src/execution/journeys/renewal/index.ts

import { AppError } from "@utils/errors";
import type { StepExecutor } from "@execution/core/registry";

export const runRenewal: StepExecutor = async ({ step }) => {
    throw new AppError({
        code: "RENEWAL_HANDLER_NOT_IMPLEMENTED",
        stage: "execution-handler",
        source: "renewal-index",
        message: `Renewal executor not implemented for subType="${step.subType ?? ""}".`,
        context: {
            subType: step.subType ?? "",
            action: step.action,
            testCaseId: step.testCaseId,
        },
    });
};