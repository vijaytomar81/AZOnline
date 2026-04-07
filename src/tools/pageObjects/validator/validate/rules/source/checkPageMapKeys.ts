// src/tools/pageObjects/validator/validate/rules/source/checkPageMapKeys.ts

import path from "node:path";

import type { TreeNode } from "@utils/cliTree";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { loadAllPageMaps } from "@pageObjectCommon/readPageMap";

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

export const checkPageMapKeys: ValidationRule = {
    id: "source.checkPageMapKeys",
    description: "Validate page-map keys and element key conventions",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const invalidItems: string[] = [];

            if (!/^[a-z0-9]+(?:\.[a-z0-9-]+){2,}$/.test(item.pageMap.pageKey)) {
                invalidItems.push("pageKey");
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Invalid",
                    message: "[pageKey]",
                    pageKey: item.pageMap.pageKey,
                    filePath: item.absPath,
                });
            }

            const elementKeys = Object.keys(item.pageMap.elements ?? {});
            if (elementKeys.length === 0) {
                invalidItems.push("elements");
                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: "[elements]",
                    pageKey: item.pageMap.pageKey,
                    filePath: item.absPath,
                });
            }

            const invalidElementKeys = elementKeys.filter(
                (key) => !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)
            );

            if (invalidElementKeys.length > 0) {
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Invalid",
                    message: formatKeyList(invalidElementKeys),
                    pageKey: item.pageMap.pageKey,
                    filePath: item.absPath,
                });
            }

            if (invalidItems.length > 0 || invalidElementKeys.length > 0) {
                const children: TreeNode[] = [];

                if (invalidItems.length > 0) {
                    children.push({
                        severity: invalidItems.includes("elements") ? "error" : "warning",
                        title: invalidItems.includes("elements") ? "Missing" : "Invalid",
                        summary: `[${invalidItems.join(", ")}]`,
                    });
                }

                if (invalidElementKeys.length > 0) {
                    children.push({
                        severity: "warning",
                        title: "Invalid",
                        summary: formatKeyList(invalidElementKeys),
                    });
                }

                reportNodes.push({
                    title: item.pageMap.pageKey,
                    children: [
                        {
                            title: path.basename(item.absPath),
                            children,
                        },
                    ],
                });
            }
        }

        return { issues, reportNodes };
    },
};