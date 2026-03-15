// src/tools/page-object-validator/validate/rules/source/checkPageMapSchema.ts

import path from "node:path";

import type { TreeNode } from "@/utils/cliTree";
import { safeReadJson } from "@/utils/fs";
import type { PageMap } from "@/tools/page-object-generator/generator/types";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { listPageMapFiles } from "../../shared/readPageMap";

export const checkPageMapSchema: ValidationRule = {
    id: "source.checkPageMapSchema",
    description: "Validate page-map JSON structure",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const fileName of listPageMapFiles(ctx.mapsDir)) {
            const absPath = path.join(ctx.mapsDir, fileName);
            const pageMap = safeReadJson<PageMap>(absPath);

            const missingItems: string[] = [];

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

            if (typeof pageMap.pageKey !== "string" || !pageMap.pageKey.trim()) {
                missingItems.push("pageKey");
                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: "[pageKey]",
                    filePath: absPath,
                });
            }

            if (!pageMap.elements || typeof pageMap.elements !== "object") {
                missingItems.push("elements");
                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: "[elements]",
                    pageKey: pageMap.pageKey,
                    filePath: absPath,
                });
            }

            if (missingItems.length > 0) {
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
        }

        return { issues, reportNodes };
    },
};