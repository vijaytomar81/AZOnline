// src/execution/journeys/newBusiness/index.ts

import type { StepExecutor } from "@execution/core/registry";
import { getNewBusinessHandler } from "./handlers";

export const runNewBusiness: StepExecutor = async (args) => {
    const handler = getNewBusinessHandler({
        journey: args.context.scenario.journey,
        entryPoint: args.context.scenario.entryPoint,
    });

    await handler(args);
};