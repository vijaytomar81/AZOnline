// src/tools/page-object-validator/validate/rules/pageChain/checkPageObjectStructure.ts

import fs from "node:fs";

import type { TreeNode } from "@/utils/cliTree";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { getPageArtifactPaths } from "../../../../page-object-common/pagePaths";
import { loadAllPageMaps } from "../../../../page-object-common/readPageMap";

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

export const checkPageObjectStructure: ValidationRule = {
    id: "pageChain.checkPageObjectStructure",
    description: "Validate page object structure and managed alias markers",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const artifact = getPageArtifactPaths(ctx.pageObjectsDir, item.pageMap.pageKey);
            if (!fs.existsSync(artifact.pageObjectPath)) continue;

            const pageObjectTs = fs.readFileSync(artifact.pageObjectPath, "utf8");
            const missingItems: string[] = [];

            if (!pageObjectTs.includes("// <scanner:aliases>")) {
                missingItems.push("openingMarker");
            }

            if (!pageObjectTs.includes("// </scanner:aliases>")) {
                missingItems.push("closingMarker");
            }

            if (!pageObjectTs.includes(`export class ${artifact.className}`)) {
                missingItems.push("classDeclaration");
            }

            if (missingItems.length > 0) {
                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: formatKeyList(missingItems),
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
                                    summary: formatKeyList(missingItems),
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