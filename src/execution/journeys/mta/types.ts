// src/execution/journeys/mta/types.ts

import type { StepExecutorArgs } from "@execution/core/registry";

export type MtaHandler = (
    args: StepExecutorArgs
) => Promise<void>;