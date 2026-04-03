// src/pageActionTools/page-action-repair/repair/types.ts

export type RepairIssue = {
    level: "warning" | "error";
    message: string;
};

export type RepairRuleResult = {
    category: string;
    name: string;
    appliedFixes: string[];
    issues: RepairIssue[];
};

export type RepairContext = {
    verbose: boolean;
};

export type RepairRule = {
    category: string;
    name: string;
    description: string;
    run: (context: RepairContext) => RepairRuleResult;
};
