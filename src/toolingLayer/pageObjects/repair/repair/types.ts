// src/toolingLayer/pageObjects/repair/repair/types.ts

import type { TreeNode } from "@utils/cliTree";

export type RepairRuleResult = {
    changedFiles: number;
    repairedPages: number;
    reportNodes?: TreeNode[];
};

export type RepairRuleExecutionResult = {
    ruleId: string;
    description: string;
    changedFiles: number;
    repairedPages: number;
    reportNodes?: TreeNode[];
};

export type RepairSummary = {
    totalRules: number;
    changedRules: number;
    totalChangedFiles: number;
    totalRepairedPages: number;
};

export type RepairRunResult = {
    perRule: RepairRuleExecutionResult[];
    summary: RepairSummary;
};