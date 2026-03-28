// src/execution/journeys/newBusiness/pcwTool/outputs/writePcwToolOutputs.ts

import type { StepExecutorArgs } from "@execution/core/registry";
import { writeNewBusinessOutputs } from "./writeNewBusinessOutputs";
import { writePcwToolSpecificOutputs } from "./writePcwToolSpecificOutputs";

export function writePcwToolOutputs(args: {
    executorArgs: StepExecutorArgs;
    journey: string;
    calculatedEmailId: string;
    requestMessage: string;
    finalRequestMessage: string;
    iql: string;
    paymentMode: string;
    stepData?: Record<string, unknown>;
}): void {
    writeNewBusinessOutputs({
        executorArgs: args.executorArgs,
        journey: args.journey,
        calculatedEmailId: args.calculatedEmailId,
    });

    writePcwToolSpecificOutputs({
        executorArgs: args.executorArgs,
        requestMessage: args.requestMessage,
        finalRequestMessage: args.finalRequestMessage,
        iql: args.iql,
        paymentMode: args.paymentMode,
        stepData: args.stepData,
    });
}
