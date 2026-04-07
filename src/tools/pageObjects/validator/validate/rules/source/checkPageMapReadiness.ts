// src/tools/pageObjects/validator/validate/rules/source/checkPageMapReadiness.ts

import path from "node:path";

import type { TreeNode } from "@utils/cliTree";
import { safeReadJson } from "@utils/fs";
import type { PageMap } from "@pageObjectGenerator/generator/types";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { listPageMapFiles } from "@pageObjectCommon/readPageMap";

type PageMapReadiness = {
    recommendedAliases?: unknown;
};

type PageMapWithReadiness = PageMap & {
    readiness?: PageMapReadiness;
};

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(isNonEmptyString);
}

function collectReadinessIssues(pageMap: PageMapWithReadiness): string[] {
    const issues: string[] = [];
    const readiness = pageMap.readiness;

    if (!readiness) {
        return issues;
    }

    if (!("recommendedAliases" in readiness)) {
        issues.push("readiness.recommendedAliases");
        return issues;
    }

    if (!isStringArray(readiness.recommendedAliases)) {
        issues.push("readiness.recommendedAliases");
        return issues;
    }

    if (readiness.recommendedAliases.length === 0) {
        issues.push("readiness.recommendedAliases");
        return issues;
    }

    const elementKeys = new Set(Object.keys(pageMap.elements ?? {}));
    const missingAliases = readiness.recommendedAliases.filter(
        (aliasKey) => !elementKeys.has(aliasKey)
    );

    if (missingAliases.length > 0) {
        issues.push(...missingAliases.map((key) => `recommendedAlias:${key}`));
    }

    return issues;
}

function buildReportNode(
    pageKey: string,
    fileName: string,
    invalidItems: string[]
): TreeNode {
    return {
        title: pageKey || fileName,
        children: [
            {
                title: fileName,
                children: [
                    {
                        severity: "error",
                        title: "Invalid",
                        summary: formatKeyList(invalidItems),
                    },
                ],
            },
        ],
    };
}

export const checkPageMapReadiness: ValidationRule = {
    id: "source.checkPageMapReadiness",
    description: "Validate page-map readiness metadata",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const fileName of listPageMapFiles(ctx.mapsDir)) {
            const absPath = path.join(ctx.mapsDir, fileName);
            const pageMap = safeReadJson<PageMapWithReadiness>(absPath);

            if (!pageMap) {
                continue;
            }

            const invalidItems = collectReadinessIssues(pageMap);

            if (invalidItems.length === 0) {
                continue;
            }

            issues.push({
                ruleId: this.id,
                severity: "ERROR",
                issueLabel: "Invalid",
                message: formatKeyList(invalidItems),
                pageKey: pageMap.pageKey,
                filePath: absPath,
            });

            reportNodes.push(
                buildReportNode(pageMap.pageKey, fileName, invalidItems)
            );
        }

        return { issues, reportNodes };
    },
};