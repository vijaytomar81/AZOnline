// src/tools/page-object-validator/validate/rules/pageChain/checkBusinessAliasesToPageObject.ts

import fs from "node:fs";

import type { TreeNode } from "@/utils/cliTree";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import {
    extractExportedObjectKeys,
    extractMethodNames,
} from "../../shared/extractTsObjectKeys";
import { getPageArtifactPaths } from "../../shared/pagePaths";
import { loadAllPageMaps } from "../../shared/readPageMap";

function extractManagedRegion(pageObjectTs: string): string {
    const startToken = "// <scanner:aliases>";
    const endToken = "// </scanner:aliases>";

    const start = pageObjectTs.indexOf(startToken);
    const end = pageObjectTs.indexOf(endToken);

    if (start < 0 || end < 0 || end < start) return "";
    return pageObjectTs.slice(start, end + endToken.length);
}

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

export const checkBusinessAliasesToPageObject: ValidationRule = {
    id: "pageChain.checkBusinessAliasesToPageObject",
    description: "Validate aliases.ts keys exist as page object methods",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const artifact = getPageArtifactPaths(ctx.pageObjectsDir, item.pageMap.pageKey);
            if (!fs.existsSync(artifact.aliasesHumanPath) || !fs.existsSync(artifact.pageObjectPath)) {
                continue;
            }

            const aliasesTs = fs.readFileSync(artifact.aliasesHumanPath, "utf8");
            const pageObjectTs = fs.readFileSync(artifact.pageObjectPath, "utf8");

            const businessAliases = extractExportedObjectKeys(aliasesTs, "aliases");
            const methodNames = extractMethodNames(extractManagedRegion(pageObjectTs));

            const missingMethods = Array.from(businessAliases).filter(
                (key) => !methodNames.has(key)
            );

            if (missingMethods.length > 0) {
                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: formatKeyList(missingMethods),
                    pageKey: item.pageMap.pageKey,
                    filePath: artifact.pageObjectPath,
                });

                reportNodes.push({
                    title: item.pageMap.pageKey,
                    children: [
                        {
                            title: artifact.className + ".ts".replace(".ts.ts", ".ts"),
                            children: [
                                {
                                    severity: "error",
                                    title: "Missing",
                                    summary: formatKeyList(missingMethods),
                                },
                            ],
                        },
                    ],
                });
            }
        }

        return { issues, reportNodes };
    },
};