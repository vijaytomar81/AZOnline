// src/execution/journeys/newBusiness/index.ts

import type { StepExecutor } from "../../runtime/registry";
import { getNewBusinessHandler } from "./handlers";

export const runNewBusiness: StepExecutor = async (args) => {
    const handler = getNewBusinessHandler(args.context.scenario.journey);
    await handler(args);
};