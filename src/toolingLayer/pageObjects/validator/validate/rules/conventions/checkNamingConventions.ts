// src/tools/pageObjects/validator/validate/rules/conventions/checkNamingConventions.ts

import path from "node:path";

import type { TreeNode } from "@utils/cliTree";
import { loadPageManifest } from "@toolingLayer/pageObjects/generator/generator/pageManifest";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

export const checkNamingConventions: ValidationRule = {
    id: "conventions.checkNamingConventions",
    description: "Validate naming conventions for page keys, class names, and element keys",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];
        const manifest = loadPageManifest(ctx.manifestFile);

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const invalidItems: string[] = [];
            const invalidElementKeys = Object.keys(item.pageMap.elements ?? {}).filter(
                (key) => !/^[a-z][A-Za-z0-9]*$/.test(key)
            );

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
                        severity: "warning",
                        title: "Invalid",
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

        for (const entry of Object.values(manifest.pages)) {
            if (!/^[A-Z][A-Za-z0-9]*Page$/.test(entry.className)) {
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Invalid",
                    message: `[${entry.className}]`,
                    pageKey: entry.pageKey,
                    filePath: ctx.manifestFile,
                });

                reportNodes.push({
                    title: entry.pageKey,
                    children: [
                        {
                            title: `${entry.pageKey}.json`,
                            children: [
                                {
                                    severity: "warning",
                                    title: "Invalid",
                                    summary: `[${entry.className}]`,
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