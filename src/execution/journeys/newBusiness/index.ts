// src/execution/journeys/newBusiness/index.ts

import type { StepExecutor } from "../../runtime/registry";
import { getNewBusinessHandler } from "./handlers";

export const runNewBusiness: StepExecutor = async (args) => {
    const handler = getNewBusinessHandler({
        journey: args.context.scenario.journey,
        journeyStartFrom: (args.context.scenario as Record<string, unknown>).journeyStartFrom as
            | string
            | undefined,
    });

    await handler(args);
};