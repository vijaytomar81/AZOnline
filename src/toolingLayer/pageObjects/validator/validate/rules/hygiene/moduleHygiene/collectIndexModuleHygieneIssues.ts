// src/toolingLayer/pageObjects/validator/validate/rules/hygiene/moduleHygiene/collectIndexModuleHygieneIssues.ts

import type { ModuleHygieneRuleResult } from "./moduleHygieneTypes";
import { formatKeyList } from "./formatKeyList";

function hasPageManagerExport(indexTs: string): boolean {
    return (
        indexTs.includes(`export { PageManager } from "./pageManager";`) ||
        indexTs.includes(`export * from "./pageManager";`)
    );
}

function hasPageObjectExport(indexTs: string): boolean {
    return (
        indexTs.includes(`export * from "@businessLayer/pageObjects/objects/`) ||
        indexTs.includes(`export * from "./objects/`)
    );
}

export function collectIndexModuleHygieneIssues(
    ruleId: string,
    filePath: string,
    indexTs: string
): ModuleHygieneRuleResult {
    const issues = [];
    const missingItems: string[] = [];

    if (!hasPageManagerExport(indexTs)) {
        missingItems.push("PageManagerExport");
        issues.push({
            ruleId,
            severity: "WARN" as const,
            issueLabel: "Missing",
            message: "[PageManagerExport]",
            filePath,
        });
    }

    if (!hasPageObjectExport(indexTs)) {
        missingItems.push("PageObjectExport");
        issues.push({
            ruleId,
            severity: "WARN" as const,
            issueLabel: "Missing",
            message: "[PageObjectExport]",
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
                              title: "index.ts",
                              children: [
                                  {
                                      severity: "warning",
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
