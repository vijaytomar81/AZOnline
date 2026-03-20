// src/execution/journeys/mtc/index.ts

import type { StepExecutor } from "../../runtime/registry";

export const runMtc: StepExecutor = async ({ step }) => {
    throw new Error(
        `MTC executor not implemented for subType="${step.subType ?? ""}".`
    );
};