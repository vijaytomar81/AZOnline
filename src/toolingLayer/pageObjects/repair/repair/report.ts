// src/toolingLayer/pageObjects/repair/repair/report.ts

import { printTree, type TreeNode } from "@utils/cliTree";
import {
    info,
    printSection,
    success,
    warning,
} from "@utils/cliFormat";
import { UI_SEVERITIES } from "@configLayer/core/uiSeverities";
import {
    REPAIR_GROUP_KEYS,
    type RepairGroupKey,
} from "@configLayer/tooling/pageObjects";
import type { RepairRuleExecutionResult, RepairRunResult } from "./types";

type RepairGroupBucket = {
    key: RepairGroupKey;
    rules: RepairRuleExecutionResult[];
};

function ruleGroupFromRuleId(ruleId: string): RepairGroupKey {
    if (ruleId === "repair.elementsToGeneratedAliases") return REPAIR_GROUP_KEYS.PAGE_CHAIN;
    if (ruleId === "repair.generatedAliasesToAliases") return REPAIR_GROUP_KEYS.PAGE_CHAIN;
    if (ruleId === "repair.aliasesToPageObject") return REPAIR_GROUP_KEYS.PAGE_CHAIN;
    if (ruleId === "repair.manifest") return REPAIR_GROUP_KEYS.MANIFEST;
    if (ruleId === "repair.indexExports") return REPAIR_GROUP_KEYS.REGISTRY;
    if (ruleId === "repair.pageManager") return REPAIR_GROUP_KEYS.REGISTRY;
    return REPAIR_GROUP_KEYS.OTHER;
}

function orderedGroups(perRule: RepairRuleExecutionResult[]): RepairGroupBucket[] {
    const order: RepairGroupKey[] = [
        REPAIR_GROUP_KEYS.PAGE_CHAIN,
        REPAIR_GROUP_KEYS.MANIFEST,
        REPAIR_GROUP_KEYS.REGISTRY,
        REPAIR_GROUP_KEYS.OTHER,
    ];
    const buckets = new Map<RepairGroupKey, RepairRuleExecutionResult[]>();

    for (const item of perRule) {
        const group = ruleGroupFromRuleId(item.ruleId);
        const current = buckets.get(group) ?? [];
        current.push(item);
        buckets.set(group, current);
    }

    return order
        .map((key) => ({ key, rules: buckets.get(key) ?? [] }))
        .filter((bucket) => bucket.rules.length > 0);
}

function executionRuleTitle(ruleId: string): string {
    switch (ruleId) {
        case "repair.elementsToGeneratedAliases":
            return "repairElementsToGeneratedAliases";
        case "repair.generatedAliasesToAliases":
            return "repairGeneratedAliasesToAliases";
        case "repair.aliasesToPageObject":
            return "repairAliasesToPageObject";
        case "repair.manifest":
            return "repairManifest";
        case "repair.indexExports":
            return "repairIndexExports";
        case "repair.pageManager":
            return "repairPageManager";
        default:
            return ruleId.replace(/^repair\./, "");
    }
}

function pageKeyText(count: number): string {
    return `${count} pageKey repaired`;
}

function buildRuleNode(rule: RepairRuleExecutionResult, verbose: boolean): TreeNode | null {
    const changed = rule.changedFiles > 0 || rule.repairedPages > 0;

    if (!verbose && !changed) {
        return null;
    }

    return {
        severity: changed ? UI_SEVERITIES.WARNING : UI_SEVERITIES.SUCCESS,
        title: executionRuleTitle(rule.ruleId),
        summary: changed
            ? info(`(${rule.changedFiles} file(s), ${pageKeyText(rule.repairedPages)})`)
            : info("(no changes)"),
        children: rule.reportNodes,
    };
}

function buildGroupNode(group: RepairGroupBucket, verbose: boolean): TreeNode {
    const changedRules = group.rules.filter((rule) => rule.changedFiles > 0 || rule.repairedPages > 0);
    const filesChanged = changedRules.reduce((sum, rule) => sum + rule.changedFiles, 0);
    const pagesRepaired = changedRules.reduce((sum, rule) => sum + rule.repairedPages, 0);

    if (!verbose && changedRules.length === 0) {
        return {
            severity: UI_SEVERITIES.SUCCESS,
            title: group.key,
            summary: info(`(${group.rules.length} rule${group.rules.length === 1 ? "" : "s"}, no changes)`),
        };
    }

    const children = group.rules
        .map((rule) => buildRuleNode(rule, verbose))
        .filter((node): node is TreeNode => Boolean(node));

    return {
        severity: changedRules.length > 0 ? UI_SEVERITIES.WARNING : UI_SEVERITIES.SUCCESS,
        title: group.key,
        summary: changedRules.length === 0
            ? info(`(${group.rules.length} rule${group.rules.length === 1 ? "" : "s"}, no changes)`)
            : info(
                `(${changedRules.length} rule${changedRules.length === 1 ? "" : "s"}, ${filesChanged} file(s), ${pageKeyText(pagesRepaired)})`
            ),
        children,
    };
}

function summaryRuleText(rule: RepairRuleExecutionResult): string {
    if (rule.repairedPages > 0) {
        return pageKeyText(rule.repairedPages);
    }

    if (rule.changedFiles > 0) {
        return `${rule.changedFiles} file updated`;
    }

    return "no changes";
}

export function printRepairExecution(result: RepairRunResult, verbose = false): void {
    printSection("Repair execution");

    const nodes = orderedGroups(result.perRule).map((group) => buildGroupNode(group, verbose));
    printTree(nodes);
}

export function printRepairSummary(result: RepairRunResult): void {
    const groups = orderedGroups(result.perRule);
    const hasChanges = result.summary.totalChangedFiles > 0;

    printSection("REPAIR SUMMARY");

    for (const group of groups) {
        for (const rule of group.rules) {
            const groupLabel = group.key.padEnd(10, " ");
            const ruleLabel = executionRuleTitle(rule.ruleId).padEnd(34, " ");
            console.log(`${groupLabel} - ${ruleLabel} : ${summaryRuleText(rule)}`);
        }
    }

    console.log("--------------------------------");
    console.log(
        `Result           : ${hasChanges ? warning("REPAIR APPLIED") : success("NO CHANGES")}`
    );
    console.log("--------------------------------");
}