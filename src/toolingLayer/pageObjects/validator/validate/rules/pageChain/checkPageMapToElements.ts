// src/toolingLayer/pageObjects/validator/validate/rules/pageChain/checkPageMapToElements.ts

import fs from "node:fs";

import type { TreeNode } from "@utils/cliTree";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { extractExportedObjectKeys } from "@toolingLayer/pageObjects/common/extractTsObjectKeys";
import { getPageArtifactPaths } from "@toolingLayer/pageObjects/common/pagePaths";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

export const checkPageMapToElements: ValidationRule = {
    id: "pageChain.checkPageMapToElements",
    description: "Validate page-map elements against elements.ts",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const artifact = getPageArtifactPaths(ctx.pageObjectsDir, item.pageMap.pageKey);

            if (!fs.existsSync(artifact.elementsPath)) continue;

            const tsText = fs.readFileSync(artifact.elementsPath, "utf8");
            const pageMapKeys = new Set(Object.keys(item.pageMap.elements ?? {}));
            const elementKeys = extractExportedObjectKeys(tsText, "elements");

            const missingInElements = Array.from(pageMapKeys).filter(
                (key) => !elementKeys.has(key)
            );

            const extraInElements = Array.from(elementKeys).filter(
                (key) => !pageMapKeys.has(key)
            );

            if (missingInElements.length === 0 && extraInElements.length === 0) {
                continue;
            }

            if (missingInElements.length > 0) {
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Missing",
                    message: formatKeyList(missingInElements),
                    pageKey: item.pageMap.pageKey,
                    filePath: artifact.elementsPath,
                });
            }

            if (extraInElements.length > 0) {
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Extra",
                    message: formatKeyList(extraInElements),
                    pageKey: item.pageMap.pageKey,
                    filePath: artifact.elementsPath,
                });
            }

            const issueChildren: TreeNode[] = [];

            if (missingInElements.length > 0) {
                issueChildren.push({
                    severity: "warning",
                    title: "Missing",
                    summary: formatKeyList(missingInElements),
                });
            }

            if (extraInElements.length > 0) {
                issueChildren.push({
                    severity: "warning",
                    title: "Extra",
                    summary: formatKeyList(extraInElements),
                });
            }

            reportNodes.push({
                title: item.pageMap.pageKey,
                children: [
                    {
                        title: "elements.ts",
                        children: issueChildren,
                    },
                ],
            });
        }

        return { issues, reportNodes };
    },
};