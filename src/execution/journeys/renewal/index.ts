// src/execution/journeys/renewal/index.ts

import type { StepExecutor } from "../../runtime/registry";

export const runRenewal: StepExecutor = async ({ step }) => {
    throw new Error(
        `Renewal executor not implemented for subType="${step.subType ?? ""}".`
    );
};