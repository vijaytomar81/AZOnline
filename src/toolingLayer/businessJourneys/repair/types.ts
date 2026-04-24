// src/toolingLayer/businessJourneys/repair/types.ts

export type RepairStatus =
    | "created"
    | "updated"
    | "removed"
    | "unchanged"
    | "warning"
    | "failed";

export type RepairContext = {
    strict: boolean;
    verbose: boolean;
};

export type RepairDetail = {
    message: string;
};

export type RepairRuleResult = {
    group: string;
    name: string;
    status: RepairStatus;
    created: number;
    updated: number;
    removed: number;
    unchanged: number;
    warning: number;
    failed: number;
    filesCreated: number;
    filesUpdated: number;
    filesRemoved: number;
    details: RepairDetail[];
};
