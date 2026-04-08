// src/frameworkCore/executionLayer/logging/e2eScenario/renderExecutionItemBlock.ts

import type { ExecutionItemResult } from "@frameworkCore/executionLayer/contracts";
import { renderFields, safeText } from "@frameworkCore/executionLayer/logging/shared";
import { buildExecutionItemFields } from "./buildExecutionItemFields";
import { getTreeTokens } from "./getTreeTokens";

export function renderExecutionItemBlock(args: {
    item: ExecutionItemResult;
    index: number;
    total: number;
    outputs: Record<string, unknown>;
    verbose?: boolean;
}): string[] {
    const { branch, indent } = getTreeTokens(args.index, args.total);
    const testCaseRef = safeText(args.item.details?.testCaseRef ?? "");
    const lines: string[] = [];

    lines.push(
        `${branch} [ITEM ${args.item.itemNo}] ${args.item.action} | TestCaseRef=${testCaseRef}`
    );

    renderFields(
        buildExecutionItemFields({
            item: args.item,
            outputs: args.outputs,
            verbose: args.verbose,
        }),
        16
    ).forEach((line) => {
        lines.push(`${indent}${line}`);
    });

    if (args.index < args.total - 1) {
        lines.push(indent.trimEnd());
    }

    return lines;
}
