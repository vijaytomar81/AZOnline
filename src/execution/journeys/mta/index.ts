// src/execution/journeys/mta/index.ts

import type { StepExecutor } from "@execution/core/registry";
import { getMtaHandler } from "./handlers";

export const runMta: StepExecutor = async (args) => {
    const handler = getMtaHandler();
    await handler(args);
};