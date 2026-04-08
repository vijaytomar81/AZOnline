// src/toolingLayer/pageObjects/validator/validate/rules/hygiene/moduleHygiene/collectPageManagerModuleHygieneIssues.ts

import type { ModuleHygieneRuleResult } from "./moduleHygieneTypes";
import { formatKeyList } from "./formatKeyList";

function hasPageManagerClass(pageManagerTs: string): boolean {
    return pageManagerTs.includes("export class PageManager");
}

function hasGenericGetter(pageManagerTs: string): boolean {
    return (
        pageManagerTs.includes("private get<T>(") ||
        pageManagerTs.includes("private get<T> (")
    );
}

function hasPageConstructor(pageManagerTs: string): boolean {
    return (
        pageManagerTs.includes("constructor(page: Page)") ||
        pageManagerTs.includes("constructor(private readonly page: Page)")
    );
}

function hasGetterUsage(pageManagerTs: string): boolean {
    return pageManagerTs.includes("this.get(");
}

export function collectPageManagerModuleHygieneIssues(
    ruleId: string,
    filePath: string,
    pageManagerTs: string
): ModuleHygieneRuleResult {
    const issues = [];
    const missingItems: string[] = [];

    if (!hasPageManagerClass(pageManagerTs)) {
        missingItems.push("PageManagerClass");
        issues.push({
            ruleId,
            severity: "ERROR" as const,
            issueLabel: "Missing",
            message: "[PageManagerClass]",
            filePath,
        });
    }

    if (!hasGenericGetter(pageManagerTs)) {
        missingItems.push("GenericGetter");
        issues.push({
            ruleId,
            severity: "WARN" as const,
            issueLabel: "Missing",
            message: "[GenericGetter]",
            filePath,
        });
    }

    if (!hasPageConstructor(pageManagerTs)) {
        missingItems.push("PageConstructor");
        issues.push({
            ruleId,
            severity: "WARN" as const,
            issueLabel: "Missing",
            message: "[PageConstructor]",
            filePath,
        });
    }

    if (!hasGetterUsage(pageManagerTs)) {
        missingItems.push("GetterUsage");
        issues.push({
            ruleId,
            severity: "WARN" as const,
            issueLabel: "Missing",
            message: "[GetterUsage]",
            filePath,
        });
    }

    return {
        issues,
        reportNode:
            missingItems.length > 0
                ? {
                      title: "registry",
                      children: [
                          {
                              title: "pageManager.ts",
                              children: [
                                  {
                                      severity: missingItems.includes("PageManagerClass")
                                          ? "error"
                                          : "warning",
                                      title: "Missing",
                                      summary: formatKeyList(missingItems),
                                  },
                              ],
                          },
                      ],
                  }
                : undefined,
    };
}
