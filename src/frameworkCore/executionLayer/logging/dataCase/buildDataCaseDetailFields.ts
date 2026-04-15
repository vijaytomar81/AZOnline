// src/frameworkCore/executionLayer/logging/dataCase/buildDataCaseDetailFields.ts

import { CONSOLE_EVIDENCE_FIELDS } from "@configLayer/models/evidence";
import { getFirstLine } from "@frameworkCore/executionLayer/logging/shared";
import type {
    ExecutionItemResult,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import { getDataCaseDebugLines } from "./getDataCaseDebugLines";
import { shouldShowDataCaseDebugLines } from "./shouldShowDataCaseDebugLines";

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function getValue(
    item: ExecutionItemResult | undefined,
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

export function buildDataCaseDetailFields(args: {
    result: ExecutionScenarioResult;
    item?: ExecutionItemResult;
    failedItem?: ExecutionItemResult;
    outputs: Record<string, unknown>;
    verbose?: boolean;
}): Array<[string, unknown]> {

    const fields: Array<[string, unknown]> = [];

    if (
        shouldShowDataCaseDebugLines({
            verbose: args.verbose,
            result: args.result,
        })
    ) {
        getDataCaseDebugLines(args.item).forEach((d) => {
            fields.push(["DEBUG", d]);
        });
    }

    const configFields = CONSOLE_EVIDENCE_FIELDS.DATA_DETAIL;

    configFields.forEach((f) => {
        if (f.key === "status") {
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
