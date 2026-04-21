// src/toolingLayer/pageObjects/generator/generator/reporting/types.ts

import type { TreeNode } from "@utils/cliTree";

export type GenerationResult = "SUCCESS" | "WARN" | "ERROR";

export type GenerationOperation =
    | "created"
    | "updated"
    | "unchanged"
    | "failed";

export type GenerationSummaryRow = {
    label: string;
    value: string | number;
};

export type GenerationIssueCounts = {
    warnings: number;
    errors: number;
};

export type GenerationTreeInput = {
    pageReports: Array<{
        pageKey: string;
        operation: Exclude<GenerationOperation, "failed">;
        elementsStatus: string;
        aliasesGeneratedStatus: string;
        aliasesHumanStatus: string;
        pageObjectStatus: string;
        registryStatus: string;
    }>;
    invalidPages: Array<{
        pageKey: string;
        reason: string;
    }>;
    errorPages: Array<{
        pageKey: string;
        reason: string;
    }>;
};

export type GenerationTreeNode = TreeNode;
