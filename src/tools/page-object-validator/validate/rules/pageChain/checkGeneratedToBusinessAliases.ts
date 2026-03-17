// src/tools/page-object-validator/validate/rules/pageChain/checkGeneratedToBusinessAliases.ts

import fs from "node:fs";

import type { TreeNode } from "@/utils/cliTree";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import {
    extractExportedObjectKeys,
    extractReferencedObjectKeys,
} from "../../../../page-object-common/extractTsObjectKeys";
import { getPageArtifactPaths } from "../../../../page-object-common/pagePaths";
import { loadAllPageMaps } from "../../../../page-object-common/readPageMap";

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

export const checkGeneratedToBusinessAliases: ValidationRule = {
    id: "pageChain.checkGeneratedToBusinessAliases",
    description: "Validate aliases.ts mappings against aliases.generated.ts",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const artifact = getPageArtifactPaths(ctx.pageObjectsDir, item.pageMap.pageKey);
            if (!fs.existsSync(artifact.aliasesGeneratedPath) || !fs.existsSync(artifact.aliasesHumanPath)) {
                continue;
            }

            const generatedTs = fs.readFileSync(artifact.aliasesGeneratedPath, "utf8");
            const aliasesTs = fs.readFileSync(artifact.aliasesHumanPath, "utf8");

            const generatedKeys = extractExportedObjectKeys(generatedTs, "aliasesGenerated");
            const mappedKeys = extractReferencedObjectKeys(aliasesTs, "aliasesGenerated");

            const missingInAliases = Array.from(generatedKeys).filter(
                (key) => !mappedKeys.has(key)
            );

            const extraInAliases = Array.from(mappedKeys).filter(
                (key) => !generatedKeys.has(key)
            );

            if (missingInAliases.length === 0 && extraInAliases.length === 0) {
                continue;
            }

            if (missingInAliases.length > 0) {
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Missing",
                    message: formatKeyList(missingInAliases),
                    pageKey: item.pageMap.pageKey,
                    filePath: artifact.aliasesHumanPath,
                });
            }

            if (extraInAliases.length > 0) {
                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Extra",
                    message: formatKeyList(extraInAliases),
                    pageKey: item.pageMap.pageKey,
                    filePath: artifact.aliasesHumanPath,
                });
            }

            const children: TreeNode[] = [];

            if (missingInAliases.length > 0) {
                children.push({
                    severity: "warning",
                    title: "Missing",
                    summary: formatKeyList(missingInAliases),
                });
            }

            if (extraInAliases.length > 0) {
                children.push({
                    severity: "error",
                    title: "Extra",
                    summary: formatKeyList(extraInAliases),
                });
            }

            reportNodes.push({
                title: item.pageMap.pageKey,
                children: [
                    {
                        title: "aliases.ts",
                        children,
                    },
                ],
            });
        }

        return { issues, reportNodes };
    },
};