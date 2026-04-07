// src/tools/pageObjects/validator/validate/report/reportGroups.ts

import type { ValidationRuleExecutionResult } from "../types";

export type RuleGroupKey =
    | "environment"
    | "source"
    | "outputs"
    | "pageChain"
    | "manifest"
    | "registry"
    | "hygiene"
    | "conventions"
    | "other";

export type RuleGroupBucket = {
    key: RuleGroupKey;
    rules: ValidationRuleExecutionResult[];
};

function ruleGroupFromRuleId(ruleId: string): RuleGroupKey {
    if (ruleId.startsWith("environment.")) return "environment";
    if (ruleId.startsWith("source.")) return "source";
    if (ruleId.startsWith("outputs.")) return "outputs";
    if (ruleId.startsWith("pageChain.")) return "pageChain";
    if (ruleId.startsWith("manifest.")) return "manifest";
    if (ruleId.startsWith("registry.")) return "registry";
    if (ruleId.startsWith("hygiene.")) return "hygiene";
    if (ruleId.startsWith("conventions.")) return "conventions";
    return "other";
}

export function orderedValidationGroups(
    perRule: ValidationRuleExecutionResult[]
): RuleGroupBucket[] {
    const order: RuleGroupKey[] = [
        "environment",
        "source",
        "outputs",
        "pageChain",
        "manifest",
        "registry",
        "hygiene",
        "conventions",
        "other",
    ];

    const buckets = new Map<RuleGroupKey, ValidationRuleExecutionResult[]>();

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