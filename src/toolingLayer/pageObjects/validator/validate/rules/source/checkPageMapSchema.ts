// src/toolingLayer/pageObjects/validator/validate/rules/source/checkPageMapSchema.ts

import path from "node:path";

import { parsePageScope } from "@toolingLayer/pageObjects/common/manifest/parsePageScope";
import { listPageMapFiles } from "@toolingLayer/pageObjects/common/readPageMap";
import type { PageMap } from "@toolingLayer/pageObjects/generator/generator/types";
import type { TreeNode } from "@utils/cliTree";
import { safeReadJson } from "@utils/fs";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";

export const checkPageMapSchema: ValidationRule = {
    id: "source.checkPageMapSchema",
    description: "Validate page-map JSON structure",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const fileName of listPageMapFiles(ctx.mapsDir)) {
            const absPath = path.join(ctx.mapsDir, fileName);
            const pageMap = safeReadJson<PageMap>(absPath);

            if (!pageMap) {
                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Invalid",
                    message: "[json]",
                    filePath: absPath,
                });

                reportNodes.push({
                    title: fileName,
                    children: [
                        {
                            title: fileName,
                            children: [
                                {
                                    severity: "error",
                                    title: "Invalid",
                                    summary: "[json]",
                                },
                            ],
                        },
                    ],
                });
                continue;
            }

            const missingItems: string[] = [];

            if (typeof pageMap.pageKey !== "string" || !pageMap.pageKey.trim()) {
                missingItems.push("pageKey");
            } else if (!parsePageScope(pageMap.pageKey).ok) {
                missingItems.push("pageKey-format");
            }

            if (!pageMap.elements || typeof pageMap.elements !== "object") {
                missingItems.push("elements");
            }

            if (missingItems.length === 0) continue;

            for (const item of missingItems) {
                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: `[${item}]`,
                    pageKey: pageMap.pageKey,
                    filePath: absPath,
                });
            }

            reportNodes.push({
                title: pageMap.pageKey || fileName,
                children: [
                    {
                        title: fileName,
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
