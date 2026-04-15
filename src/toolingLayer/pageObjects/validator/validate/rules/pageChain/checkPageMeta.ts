// src/toolingLayer/pageObjects/validator/validate/rules/pageChain/checkPageMeta.ts

import fs from "node:fs";

import type { TreeNode } from "@utils/cliTree";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { extractStringFieldFromExportedObject } from "@toolingLayer/pageObjects/common/extractTsObjectKeys";
import { getPageArtifactPaths } from "@toolingLayer/pageObjects/common/pagePaths";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

export const checkPageMeta: ValidationRule = {
    id: "pageChain.checkPageMeta",
    description: "Validate pageMeta in aliases.generated.ts against page-map metadata",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const artifact = getPageArtifactPaths(ctx.pageObjectsDir, item.pageMap.pageKey);
            if (!fs.existsSync(artifact.aliasesGeneratedPath)) continue;

            const generatedTs = fs.readFileSync(artifact.aliasesGeneratedPath, "utf8");

            const generatedPageKey = extractStringFieldFromExportedObject(generatedTs, "pageMeta", "pageKey");
            const generatedUrlPath = extractStringFieldFromExportedObject(generatedTs, "pageMeta", "urlPath");
            const generatedTitle = extractStringFieldFromExportedObject(generatedTs, "pageMeta", "title");

            const missingItems: string[] = [];
            const mismatchItems: string[] = [];

            if (generatedPageKey !== item.pageMap.pageKey) {
                mismatchItems.push("pageKey");
            }

            if ((item.pageMap.urlPath ?? undefined) !== generatedUrlPath) {
                mismatchItems.push("urlPath");
            }

            if ((item.pageMap.title ?? undefined) !== generatedTitle) {
                mismatchItems.push("title");
            }

            if (missingItems.length > 0 || mismatchItems.length > 0) {
                const severity = mismatchItems.includes("pageKey") ? "error" : "warning";

                issues.push({
                    ruleId: this.id,
                    severity: mismatchItems.includes("pageKey") ? "ERROR" : "WARN",
                    issueLabel: "Mismatch",
                    message: formatKeyList(mismatchItems),
                    pageKey: item.pageMap.pageKey,
                    filePath: artifact.aliasesGeneratedPath,
                });

                reportNodes.push({
                    title: item.pageMap.pageKey,
                    children: [
                        {
                            title: "aliases.generated.ts",
                            children: [
                                {
                                    severity,
                                    title: "Mismatch",
                                    summary: formatKeyList(mismatchItems),
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