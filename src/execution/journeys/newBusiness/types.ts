// src/execution/journeys/newBusiness/types.ts

import type { StepExecutorArgs } from "../../runtime/registry";

export type NewBusinessHandler = (args: StepExecutorArgs) => Promise<void>;

export type NewBusinessStartFrom = "Direct" | "PCW" | "PCWTool";