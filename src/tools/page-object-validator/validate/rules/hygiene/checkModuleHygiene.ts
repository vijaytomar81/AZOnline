// src/tools/page-object-validator/validate/rules/hygiene/checkModuleHygiene.ts

import fs from "node:fs";

import type { TreeNode } from "@/utils/cliTree";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { getIndexFile, getPageManagerFile } from "../../shared/pagePaths";

export const checkModuleHygiene: ValidationRule = {
    id: "hygiene.checkModuleHygiene",
    description: "Validate registry module hygiene and expected structure",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];
        const indexFile = getIndexFile(ctx.pageRegistryDir);
        const pageManagerFile = getPageManagerFile(ctx.pageRegistryDir);

        if (fs.existsSync(indexFile)) {
            const indexTs = fs.readFileSync(indexFile, "utf8");
            const missingItems: string[] = [];

            if (!indexTs.includes(`export { PageManager } from "./pageManager";`)) {
                missingItems.push("PageManagerExport");
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Missing",
                    message: "[PageManagerExport]",
                    filePath: indexFile,
                });
            }

            if (!indexTs.includes(`export * from "@page-objects/`)) {
                missingItems.push("PageObjectExport");
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Missing",
                    message: "[PageObjectExport]",
                    filePath: indexFile,
                });
            }

            if (missingItems.length > 0) {
                reportNodes.push({
                    title: "registry",
                    children: [
                        {
                            title: "index.ts",
                            children: [
                                {
                                    severity: "warning",
                                    title: "Missing",
                                    summary: `[${missingItems.join(", ")}]`,
                                },
                            ],
                        },
                    ],
                });
            }
        } else {
            issues.push({
                ruleId: this.id,
                severity: "ERROR",
                issueLabel: "Missing",
                message: "[index.ts]",
                filePath: indexFile,
            });

            reportNodes.push({
                title: "registry",
                children: [
                    {
                        title: "index.ts",
                        children: [
                            {
                                severity: "error",
                                title: "Missing",
                                summary: "[index.ts]",
                            },
                        ],
                    },
                ],
            });
        }

        if (fs.existsSync(pageManagerFile)) {
            const pageManagerTs = fs.readFileSync(pageManagerFile, "utf8");
            const missingItems: string[] = [];

            if (!pageManagerTs.includes("export class PageManager")) {
                missingItems.push("PageManagerClass");
                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: "[PageManagerClass]",
                    filePath: pageManagerFile,
                });
            }

            if (!pageManagerTs.includes("private get<T>(") && !pageManagerTs.includes("private get<T> (")) {
                missingItems.push("GenericGetter");
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Missing",
                    message: "[GenericGetter]",
                    filePath: pageManagerFile,
                });
            }

            if (
                !pageManagerTs.includes("constructor(page: Page)") &&
                !pageManagerTs.includes("constructor(private readonly page: Page)")
            ) {
                missingItems.push("PageConstructor");
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Missing",
                    message: "[PageConstructor]",
                    filePath: pageManagerFile,
                });
            }

            if (!pageManagerTs.includes("this.get(")) {
                missingItems.push("GetterUsage");
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Missing",
                    message: "[GetterUsage]",
                    filePath: pageManagerFile,
                });
            }

            if (missingItems.length > 0) {
                reportNodes.push({
                    title: "registry",
                    children: [
                        {
                            title: "pageManager.ts",
                            children: [
                                {
                                    severity: missingItems.includes("PageManagerClass") ? "error" : "warning",
                                    title: "Missing",
                                    summary: `[${missingItems.join(", ")}]`,
                                },
                            ],
                        },
                    ],
                });
            }
        } else {
            issues.push({
                ruleId: this.id,
                severity: "ERROR",
                issueLabel: "Missing",
                message: "[pageManager.ts]",
                filePath: pageManagerFile,
            });

            reportNodes.push({
                title: "registry",
                children: [
                    {
                        title: "pageManager.ts",
                        children: [
                            {
                                severity: "error",
                                title: "Missing",
                                summary: "[pageManager.ts]",
                            },
                        ],
                    },
                ],
            });
        }

        return { issues, reportNodes };
    },
};