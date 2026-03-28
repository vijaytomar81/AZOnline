// src/execution/journeys/newBusiness/core/runNewBusiness.ts

import type { StepExecutor } from "@execution/core/registry";
import { getNewBusinessHandler } from "./getNewBusinessHandler";

export const runNewBusiness: StepExecutor = async (args) => {
    const handler = getNewBusinessHandler({
        entryPoint: args.context.scenario.entryPoint,
        journey: args.context.scenario.journey,
    });

    await handler(args);
};
