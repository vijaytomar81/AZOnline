// src/execution/journeys/mtc/types.ts

import type { StepExecutorArgs } from "@execution/core/registry";

export type MtcHandler = (
    args: StepExecutorArgs
) => Promise<void>;