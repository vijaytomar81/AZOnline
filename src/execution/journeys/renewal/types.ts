// src/execution/journeys/renewal/types.ts

import type { StepExecutorArgs } from "@execution/core/registry";

export type RenewalHandler = (
    args: StepExecutorArgs
) => Promise<void>;