// src/toolingLayer/pageObjects/validator/validate/rules/source/checkPageMapSchema.ts

import path from "node:path";

import { parsePageScope } from "@toolingLayer/pageObjects/common/manifest/parsePageScope";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";
import type { TreeNode } from "@utils/cliTree";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";

export const checkPageMapSchema: ValidationRule = {
    id: "source.checkPageMapSchema",
    description: "Validate page-map JSON structure",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const pageMap = item.pageMap;
            const missingItems: string[] = [];

            if (typeof pageMap.pageKey !== "string" || !pageMap.pageKey.trim()) {
                missingItems.push("pageKey");
            } else if (!parsePageScope(pageMap.pageKey).ok) {
                missingItems.push("pageKey-format");
            }

            if (!pageMap.elements || typeof pageMap.elements !== "object") {
                missingItems.push("elements");
            }

            if (missingItems.length === 0) {
                continue;
            }

            for (const missingItem of missingItems) {
                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: `[${missingItem}]`,
                    pageKey: pageMap.pageKey,
                    filePath: item.absPath,
                });
            }

            reportNodes.push({
                title: pageMap.pageKey || item.fileName,
                children: [
                    {
                        title: path.basename(item.absPath),
                        children: [
                            {
                                severity: "error",
                                title: "Missing",
                                summary: `[${missingItems.join(", ")}]`,
                            },
                        ],
                    },
                ],
            });
        }

        return { issues, reportNodes };
    },
};
