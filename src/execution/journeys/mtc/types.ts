// src/execution/journeys/mtc/types.ts

import type { StepExecutorArgs } from "../../runtime/registry";

export type MtcHandler = (
    args: StepExecutorArgs
) => Promise<void>;