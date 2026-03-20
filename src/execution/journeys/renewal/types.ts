// src/execution/journeys/renewal/types.ts

import type { StepExecutorArgs } from "../../runtime/registry";

export type RenewalHandler = (
    args: StepExecutorArgs
) => Promise<void>;