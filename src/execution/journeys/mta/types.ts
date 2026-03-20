// src/execution/journeys/mta/types.ts

import type { StepExecutorArgs } from "../../runtime/registry";

export type MtaHandler = (
    args: StepExecutorArgs
) => Promise<void>;