// src/pageObjectTools/page-object-validator/validate/rules/pageChain/checkPageObjectReadiness.ts

import fs from "node:fs";

import type { TreeNode } from "@utils/cliTree";
import type { PageMap } from "@/pageObjectTools/page-object-generator/generator/types";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { getPageArtifactPaths } from "../../../../page-object-common/pagePaths";
import { loadAllPageMaps } from "../../../../page-object-common/readPageMap";

type PageMapWithReadiness = PageMap & {
    readiness?: {
        recommendedAliases?: string[];
    };
};

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

function getRecommendedAliases(pageMap: PageMapWithReadiness): string[] {
    return Array.isArray(pageMap.readiness?.recommendedAliases)
        ? pageMap.readiness!.recommendedAliases
        : [];
}

function hasEmptyReadinessLocators(pageObjectTs: string): boolean {
    return pageObjectTs.includes(`const readinessLocators: Locator[] = [];`);
}

function hasAliasKeyReference(pageObjectTs: string, aliasKey: string): boolean {
    return pageObjectTs.includes(`aliasKeys.${aliasKey}`);
}

function collectMissingReadinessItems(
    pageObjectTs: string,
    recommendedAliases: string[]
): string[] {
    const missingItems: string[] = [];

    if (recommendedAliases.length === 0) {
        return missingItems;
    }

    if (hasEmptyReadinessLocators(pageObjectTs)) {
        missingItems.push("readinessLocators");
    }

    for (const aliasKey of recommendedAliases) {
        if (!hasAliasKeyReference(pageObjectTs, aliasKey)) {
            missingItems.push(`recommendedAlias:${aliasKey}`);
        }
    }

    return missingItems;
}

function buildReportNode(
    pageKey: string,
    fileTitle: string,
    missingItems: string[]
): TreeNode {
    return {
        title: pageKey,
        children: [
            {
                title: fileTitle,
                children: [
                    {
                        severity: "error",
                        title: "Missing",
                        summary: formatKeyList(missingItems),
                    },
                ],
            },
        ],
    };
}

export const checkPageObjectReadiness: ValidationRule = {
    id: "pageChain.checkPageObjectReadiness",
    description: "Validate page object readiness wiring against page-map readiness metadata",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const pageMap = item.pageMap as PageMapWithReadiness;
            const recommendedAliases = getRecommendedAliases(pageMap);

            if (recommendedAliases.length === 0) {
                continue;
            }

            const artifact = getPageArtifactPaths(ctx.pageObjectsDir, pageMap.pageKey);

            if (!fs.existsSync(artifact.pageObjectPath)) {
                continue;
            }

            const pageObjectTs = fs.readFileSync(artifact.pageObjectPath, "utf8");
            const missingItems = collectMissingReadinessItems(
                pageObjectTs,
                recommendedAliases
            );

            if (missingItems.length === 0) {
                continue;
            }

            issues.push({
                ruleId: this.id,
                severity: "ERROR",
                issueLabel: "Missing",
                message: formatKeyList(missingItems),
                pageKey: pageMap.pageKey,
                filePath: artifact.pageObjectPath,
            });

            reportNodes.push(
                buildReportNode(
                    pageMap.pageKey,
                    artifact.className + ".ts".replace(".ts.ts", ".ts"),
                    missingItems
                )
            );
        }

        return { issues, reportNodes };
    },
};