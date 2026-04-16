// src/toolingLayer/pageObjects/generator/generator/reporting/types.ts

import type { TreeNode } from "@utils/cliTree";

export type GenerationResult = "SUCCESS" | "WARN" | "ERROR";

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
        changed: boolean;
        elementsStatus: string;
        aliasesGeneratedStatus: string;
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
