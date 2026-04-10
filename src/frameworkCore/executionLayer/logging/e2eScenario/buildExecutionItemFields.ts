// src/frameworkCore/executionLayer/logging/e2eScenario/buildExecutionItemFields.ts

import { CONSOLE_EVIDENCE_FIELDS } from "@configLayer/models/evidence";
import type { ExecutionItemResult } from "@frameworkCore/executionLayer/contracts";
import {
    getFirstLine,
    itemDuration,
    statusText,
} from "@frameworkCore/executionLayer/logging/shared";
import { getExecutionItemDebugLines } from "./getExecutionItemDebugLines";
import { shouldShowExecutionItemDebugLines } from "./shouldShowExecutionItemDebugLines";

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function getValue(
    item: ExecutionItemResult,
    outputs: Record<string, unknown>,
    key: string
): unknown {
    const itemRecord = asRecord(item);
    const details = asRecord(itemRecord.details);
    const detailOutputs = asRecord(details.outputs);

    return (
        itemRecord[key] ??
        details[key] ??
        detailOutputs[key] ??
        outputs[key]
    );
}

export function buildExecutionItemFields(args: {
    item: ExecutionItemResult;
    outputs: Record<string, unknown>;
    verbose?: boolean;
}): Array<[string, unknown]> {

    const fields: Array<[string, unknown]> = [];

    if (
        shouldShowExecutionItemDebugLines({
            verbose: args.verbose,
            item: args.item,
        })
    ) {
        getExecutionItemDebugLines(args.item).forEach((d) => {
            fields.push(["DEBUG", d]);
        });
    }

    fields.push(["Status", statusText(args.item.status)]);
    fields.push(["Duration", itemDuration(args.item)]);

    const configFields = CONSOLE_EVIDENCE_FIELDS.E2E_ITEM;

    configFields.forEach((f) => {
        if (f.key === "status" || f.key === "itemNo" || f.key === "action") {
            return;
        }

        const value = getValue(args.item, args.outputs, f.key);

        if (value !== undefined && value !== "") {
            const finalValue =
                f.key === "errorDetails"
                    ? getFirstLine(value)
                    : value;

            fields.push([f.label, finalValue]);
        }
    });

    return fields;
}
