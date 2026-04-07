// src/executionLayer/logging/e2eScenario/buildExecutionItemFields.ts

import type { ExecutionItemResult } from "@frameworkCore/executionLayer/contracts";
import { OUTPUT_KEYS } from "@frameworkCore/executionLayer/constants/outputKeys";
import {
    collectFieldIfPresent,
    itemDuration,
    statusText,
} from "@frameworkCore/executionLayer/logging/shared";
import { getExecutionItemDebugLines } from "./getExecutionItemDebugLines";
import { shouldShowExecutionItemDebugLines } from "./shouldShowExecutionItemDebugLines";

export function buildExecutionItemFields(args: {
    item: ExecutionItemResult;
    outputs: Record<string, unknown>;
    verbose?: boolean;
}): Array<[string, unknown]> {
    const itemFields: Array<[string, unknown]> = [];

    if (shouldShowExecutionItemDebugLines({
        verbose: args.verbose,
        item: args.item,
    })) {
        getExecutionItemDebugLines(args.item).forEach((debugLine) => {
            itemFields.push(["DEBUG", debugLine]);
        });
    }

    itemFields.push(["Status", statusText(args.item.status)]);
    itemFields.push(["Duration", itemDuration(args.item)]);

    if (args.item.action === "NewBusiness") {
        collectFieldIfPresent(
            itemFields,
            "CalculatedEmail",
            args.outputs[OUTPUT_KEYS.NEW_BUSINESS.CALCULATED_EMAIL]
        );
        collectFieldIfPresent(
            itemFields,
            "QuoteNumber",
            args.outputs[OUTPUT_KEYS.NEW_BUSINESS.QUOTE]
        );
        collectFieldIfPresent(
            itemFields,
            "PolicyNumber",
            args.outputs[OUTPUT_KEYS.NEW_BUSINESS.POLICY]
        );
    }

    if (args.item.message) {
        collectFieldIfPresent(itemFields, "Error", args.item.message);
    }

    return itemFields;
}
