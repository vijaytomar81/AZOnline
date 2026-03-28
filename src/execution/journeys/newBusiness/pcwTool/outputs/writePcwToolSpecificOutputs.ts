// src/execution/journeys/newBusiness/pcwTool/outputs/writePcwToolSpecificOutputs.ts

import { normalizeSpaces } from "@utils/text";
import { OUTPUT_KEYS } from "@execution/constants/outputKeys";
import { setContextOutput } from "@execution/core/executionContext";
import type { StepExecutorArgs } from "@execution/core/registry";
import { detectPcwToolRequestType } from "../detectPcwToolRequestType";

export function writePcwToolSpecificOutputs(args: {
    executorArgs: StepExecutorArgs;
    requestMessage: string;
    finalRequestMessage: string;
    iql: string;
    paymentMode: string;
    stepData?: Record<string, unknown>;
}): void {
    const convertToMonthlyCard = normalizeSpaces(
        String(
            (args.stepData?.pcwTool as Record<string, unknown> | undefined)
                ?.convertToMonthlyCard ?? ""
        )
    );

    setContextOutput(
        args.executorArgs.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.IQL,
        args.iql
    );
    setContextOutput(
        args.executorArgs.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.PAYMENT_MODE,
        args.paymentMode
    );
    setContextOutput(
        args.executorArgs.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.CONVERT_TO_MONTHLY_CARD,
        convertToMonthlyCard
    );
    setContextOutput(
        args.executorArgs.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.REQUEST_MESSAGE_RAW,
        args.requestMessage
    );
    setContextOutput(
        args.executorArgs.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.REQUEST_MESSAGE_FINAL,
        args.finalRequestMessage
    );
    setContextOutput(
        args.executorArgs.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.REQUEST_TYPE,
        detectPcwToolRequestType(args.requestMessage)
    );
    setContextOutput(
        args.executorArgs.context,
        OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.PAYLOAD,
        args.stepData ?? {}
    );
}
