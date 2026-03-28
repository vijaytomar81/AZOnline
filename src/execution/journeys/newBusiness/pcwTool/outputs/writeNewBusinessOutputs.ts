// src/execution/journeys/newBusiness/pcwTool/outputs/writeNewBusinessOutputs.ts

import { OUTPUT_KEYS } from "@execution/constants/outputKeys";
import { setContextOutput } from "@execution/core/executionContext";
import type { StepExecutorArgs } from "@execution/core/registry";

export function writeNewBusinessOutputs(args: {
    executorArgs: StepExecutorArgs;
    journey: string;
    calculatedEmailId: string;
}): void {
    setContextOutput(
        args.executorArgs.context,
        OUTPUT_KEYS.NEW_BUSINESS.LAST_ACTION,
        args.executorArgs.step.action
    );
    setContextOutput(
        args.executorArgs.context,
        OUTPUT_KEYS.NEW_BUSINESS.LAST_JOURNEY,
        args.journey
    );
    setContextOutput(
        args.executorArgs.context,
        OUTPUT_KEYS.NEW_BUSINESS.START_FROM,
        "PCWTool"
    );
    setContextOutput(
        args.executorArgs.context,
        OUTPUT_KEYS.NEW_BUSINESS.JOURNEY,
        args.journey
    );
    setContextOutput(
        args.executorArgs.context,
        OUTPUT_KEYS.NEW_BUSINESS.CALCULATED_EMAIL,
        args.calculatedEmailId
    );
}
