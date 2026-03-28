// src/execution/journeys/newBusiness/core/getNewBusinessHandler.ts

import { runNewBusinessPcwTool } from "../pcwTool/runNewBusinessPcwTool";
import { runDirectNewBusiness } from "./runDirectNewBusiness";
import { runPcwNewBusiness } from "./runPcwNewBusiness";
import { resolveNewBusinessStartFrom } from "./resolveNewBusinessStartFrom";
import type { NewBusinessHandler, NewBusinessStartFrom } from "./types";

const startFromHandlers: Record<NewBusinessStartFrom, NewBusinessHandler> = {
    Direct: runDirectNewBusiness,
    PCW: runPcwNewBusiness,
    PCWTool: runNewBusinessPcwTool,
};

export function getNewBusinessHandler(args: {
    journey?: string;
    entryPoint?: string;
}): NewBusinessHandler {
    const startFrom = resolveNewBusinessStartFrom(args);
    return startFromHandlers[startFrom];
}
