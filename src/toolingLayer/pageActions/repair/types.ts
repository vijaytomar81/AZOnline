// src/toolingLayer/pageActions/repair/types.ts

export type RepairMode = "normal" | "strict";

export type RepairRuleStatus =
    | "unchanged"
    | "repaired"
    | "warning"
    | "failed";

export type RepairDetail = {
    message: string;
};

export type RepairRuleResult = {
    name: string;
    group: string;
    status: RepairRuleStatus;
    changedFiles: number;
    repairedItems: number;
    warnings: number;
    errors: number;
    details: RepairDetail[];
};

export type RepairSummary = {
    rulesRun: number;
    repairedRules: number;
    unchangedRules: number;
    warningRules: number;
    failedRules: number;
    changedFiles: number;
    repairedItems: number;
    warnings: number;
    errors: number;
    exitCode: number;
};

export type RepairContext = {
    strict: boolean;
    verbose: boolean;
};
