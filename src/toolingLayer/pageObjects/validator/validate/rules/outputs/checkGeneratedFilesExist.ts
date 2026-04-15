// src/toolingLayer/pageObjects/validator/validate/rules/outputs/checkGeneratedFilesExist.ts

import fs from "node:fs";

import type { TreeNode } from "@utils/cliTree";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { getPageArtifactPaths } from "@toolingLayer/pageObjects/common/pagePaths";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

export const checkGeneratedFilesExist: ValidationRule = {
    id: "outputs.checkGeneratedFilesExist",
    description: "Validate generated page object files exist",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const artifact = getPageArtifactPaths(ctx.pageObjectsDir, item.pageMap.pageKey);

            const missingFiles: string[] = [];

            const requiredFiles = [
                artifact.elementsPath,
                artifact.aliasesGeneratedPath,
                artifact.aliasesHumanPath,
                artifact.pageObjectPath,
            ];

            for (const filePath of requiredFiles) {
                if (!fs.existsSync(filePath)) {
                    const fileName = filePath.split("/").pop() ?? filePath;
                    missingFiles.push(fileName);

                    issues.push({
                        ruleId: this.id,
                        severity: "ERROR",
                        issueLabel: "Missing",
                        message: `[${fileName}]`,
                        pageKey: item.pageMap.pageKey,
                        filePath,
                    });
                }
            }

            if (missingFiles.length > 0) {
                reportNodes.push({
                    title: item.pageMap.pageKey,
                    children: [
                        {
                            title: "generated-files",
                            children: [
                                {
                                    severity: "error",
                                    title: "Missing",
                                    summary: formatKeyList(missingFiles),
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