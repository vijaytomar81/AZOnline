// src/frameworkCore/executionLayer/logging/dataCase/buildDataCaseDetailFields.ts

import type {
    ExecutionItemResult,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import { OUTPUT_KEYS } from "@frameworkCore/executionLayer/constants/outputKeys";
import { collectFieldIfPresent } from "@frameworkCore/executionLayer/logging/shared";
import { formatRequestPreview } from "./formatRequestPreview";
import { getDataCaseDebugLines } from "./getDataCaseDebugLines";
import { shouldShowDataCaseDebugLines } from "./shouldShowDataCaseDebugLines";

function firstMeaningfulLine(value: unknown): string {
    return String(value ?? "")
        .split("\n")
        .map((line) => line.trim())
        .find(Boolean) ?? "";
}

export function buildDataCaseDetailFields(args: {
    result: ExecutionScenarioResult;
    item?: ExecutionItemResult;
    failedItem?: ExecutionItemResult;
    outputs: Record<string, unknown>;
    verbose?: boolean;
}): Array<[string, unknown]> {
    const detailFields: Array<[string, unknown]> = [];

    if (shouldShowDataCaseDebugLines({
        verbose: args.verbose,
        result: args.result,
    })) {
        getDataCaseDebugLines(args.item).forEach((debugLine) => {
            detailFields.push(["DEBUG", debugLine]);
        });
    }

    collectFieldIfPresent(
        detailFields,
        "PaymentMode",
        args.outputs[OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.PAYMENT_MODE]
    );
    collectFieldIfPresent(
        detailFields,
        "IQL",
        args.outputs[OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.IQL]
    );

    const monthlyCard =
        args.outputs[OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.PAYMENT_MODE] !== undefined
            ? args.outputs[OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.CONVERT_TO_MONTHLY_CARD] || "(blank)"
            : undefined;

    collectFieldIfPresent(detailFields, "Monthly Card", monthlyCard);
    collectFieldIfPresent(
        detailFields,
        "RequestType",
        args.outputs[OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.REQUEST_TYPE]
    );
    collectFieldIfPresent(
        detailFields,
        "RequestMessage",
        formatRequestPreview(
            args.outputs[OUTPUT_KEYS.NEW_BUSINESS.PCW_TOOL.REQUEST_MESSAGE_FINAL]
        )
    );
    collectFieldIfPresent(
        detailFields,
        "CalculatedEmail",
        args.outputs[OUTPUT_KEYS.NEW_BUSINESS.CALCULATED_EMAIL]
    );
    collectFieldIfPresent(
        detailFields,
        "QuoteNumber",
        args.outputs[OUTPUT_KEYS.NEW_BUSINESS.QUOTE]
    );
    collectFieldIfPresent(
        detailFields,
        "PolicyNumber",
        args.outputs[OUTPUT_KEYS.NEW_BUSINESS.POLICY]
    );

    if (args.failedItem?.message) {
        collectFieldIfPresent(
            detailFields,
            "Error",
            firstMeaningfulLine(args.failedItem.message)
        );
    }

    return detailFields;
}