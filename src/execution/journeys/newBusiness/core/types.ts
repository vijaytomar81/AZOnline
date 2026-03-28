// src/execution/journeys/newBusiness/core/types.ts

import type { StepExecutorArgs } from "@execution/core/registry";

export type NewBusinessHandler = (args: StepExecutorArgs) => Promise<void>;

export type NewBusinessStartFrom = "Direct" | "PCW" | "PCWTool";
