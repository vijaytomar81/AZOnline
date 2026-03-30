// src/pageObjectTools/page-object-repair/repair/pipeline/helpers.ts

import type {
    RepairRuleExecutionResult,
    RepairSummary,
} from "../types";
import type { RepairRule } from "./types";
import type { RepairRuleResult } from "../types";

export function toExecutionResult(
    rule: RepairRule,
    result: RepairRuleResult
): RepairRuleExecutionResult {
    return {
        ruleId: rule.id,
        description: rule.description,
        changedFiles: result.changedFiles,
        repairedPages: result.repairedPages,
        reportNodes: result.reportNodes,
    };
}

export function buildRepairSummary(
    perRule: RepairRuleExecutionResult[]
): RepairSummary {
    let changedRules = 0;
    let totalChangedFiles = 0;
    let totalRepairedPages = 0;

    for (const item of perRule) {
        totalChangedFiles += item.changedFiles;
        totalRepairedPages += item.repairedPages;

        if (item.changedFiles > 0) {
            changedRules++;
        }
    }

    return {
        totalRules: perRule.length,
        changedRules,
        totalChangedFiles,
        totalRepairedPages,
    };
}