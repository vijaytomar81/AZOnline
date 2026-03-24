// src/tools/page-object-validator/validate/rules/pageChain/checkElementsToGeneratedAliases.ts

import fs from "node:fs";

import type { TreeNode } from "@utils/cliTree";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { extractExportedObjectKeys } from "../../../../page-object-common/extractTsObjectKeys";
import { getPageArtifactPaths } from "../../../../page-object-common/pagePaths";
import { loadAllPageMaps } from "../../../../page-object-common/readPageMap";

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

export const checkElementsToGeneratedAliases: ValidationRule = {
    id: "pageChain.checkElementsToGeneratedAliases",
    description: "Validate elements.ts matches aliases.generated.ts",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const artifact = getPageArtifactPaths(ctx.pageObjectsDir, item.pageMap.pageKey);

            if (!fs.existsSync(artifact.elementsPath) || !fs.existsSync(artifact.aliasesGeneratedPath)) {
                continue;
            }

            const elementsTs = fs.readFileSync(artifact.elementsPath, "utf8");
            const aliasesGeneratedTs = fs.readFileSync(artifact.aliasesGeneratedPath, "utf8");

            const elementKeys = extractExportedObjectKeys(elementsTs, "elements");
            const generatedKeys = extractExportedObjectKeys(aliasesGeneratedTs, "aliasesGenerated");

            const missingInGenerated = Array.from(elementKeys).filter(
                (key) => !generatedKeys.has(key)
            );

            const extraInGenerated = Array.from(generatedKeys).filter(
                (key) => !elementKeys.has(key)
            );

            if (missingInGenerated.length === 0 && extraInGenerated.length === 0) {
                continue;
            }

            if (missingInGenerated.length > 0) {
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Missing",
                    message: formatKeyList(missingInGenerated),
                    pageKey: item.pageMap.pageKey,
                    filePath: artifact.aliasesGeneratedPath,
                });
            }

            if (extraInGenerated.length > 0) {
                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Extra",
                    message: formatKeyList(extraInGenerated),
                    pageKey: item.pageMap.pageKey,
                    filePath: artifact.aliasesGeneratedPath,
                });
            }

            const issueChildren: TreeNode[] = [];

            if (missingInGenerated.length > 0) {
                issueChildren.push({
                    severity: "warning",
                    title: "Missing",
                    summary: formatKeyList(missingInGenerated),
                });
            }

            if (extraInGenerated.length > 0) {
                issueChildren.push({
                    severity: "error",
                    title: "Extra",
                    summary: formatKeyList(extraInGenerated),
                });
            }

            reportNodes.push({
                title: item.pageMap.pageKey,
                children: [
                    {
                        title: "aliases.generated.ts",
                        children: issueChildren,
                    },
                ],
            });
        }

        return { issues, reportNodes };
    },
};