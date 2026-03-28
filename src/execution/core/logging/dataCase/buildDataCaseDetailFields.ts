// src/execution/core/logging/dataCase/buildDataCaseDetailFields.ts

import type {
    ScenarioExecutionResult,
    StepExecutionResult,
} from "@execution/core/result";
import { OUTPUT_KEYS } from "@execution/constants/outputKeys";
import { collectFieldIfPresent } from "@execution/core/logging/shared";
import { formatRequestPreview } from "./formatRequestPreview";
import { getDataCaseDebugLines } from "./getDataCaseDebugLines";
import { shouldShowDataCaseDebugLines } from "./shouldShowDataCaseDebugLines";

export function buildDataCaseDetailFields(args: {
    result: ScenarioExecutionResult;
    step?: StepExecutionResult;
    failedStep?: StepExecutionResult;
    outputs: Record<string, unknown>;
    verbose?: boolean;
}): Array<[string, unknown]> {
    const detailFields: Array<[string, unknown]> = [];

    if (shouldShowDataCaseDebugLines({
        verbose: args.verbose,
        result: args.result,
    })) {
        getDataCaseDebugLines(args.step).forEach((debugLine) => {
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

    if (args.failedStep?.message) {
        collectFieldIfPresent(detailFields, "Error", args.failedStep.message);
    }

    return detailFields;
}
