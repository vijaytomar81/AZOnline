// src/execution/journeys/newBusiness/pcwTool/runNewBusinessPcwTool.ts

import type { StepExecutorArgs } from "@execution/core/registry";
import { getCalculatedEmailId } from "./getCalculatedEmailId";
import { getPcwToolData } from "./getPcwToolData";
import { injectPcwToolTokens } from "./injectPcwToolTokens";
import { requirePcwToolField } from "./requirePcwToolField";
import { resolvePcwToolJourney } from "./resolvePcwToolJourney";
import { writePcwToolOutputs } from "./outputs/writePcwToolOutputs";

export async function runNewBusinessPcwTool(
    args: StepExecutorArgs
): Promise<void> {
    const pcwTool = getPcwToolData(args.stepData);

    const requestMessage = requirePcwToolField(pcwTool, "requestMessage");
    const iql = requirePcwToolField(pcwTool, "iql");
    const paymentMode = requirePcwToolField(pcwTool, "paymentMode");
    const journey = resolvePcwToolJourney(args.stepData);

    const calculatedEmailId = getCalculatedEmailId(args);
    const finalRequestMessage = injectPcwToolTokens(requestMessage, {
        CalculatedEmailId: calculatedEmailId,
    });

    writePcwToolOutputs({
        executorArgs: args,
        journey,
        calculatedEmailId,
        requestMessage,
        finalRequestMessage,
        iql,
        paymentMode,
        stepData: args.stepData,
    });
}
