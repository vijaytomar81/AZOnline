// src/pageObjectTools/page-object-validator/validate/rules/environment/checkEnvironment.ts

import fs from "node:fs";

import type { TreeNode } from "@utils/cliTree";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { listPageMapFiles } from "../../../../page-object-common/readPageMap";

export const checkEnvironment: ValidationRule = {
    id: "environment.checkEnvironment",
    description: "Validate validator environment and required paths",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        const dirs: Array<{ label: string; dir: string }> = [
            { label: "mapsDir", dir: ctx.mapsDir },
            { label: "pageObjectsDir", dir: ctx.pageObjectsDir },
            { label: "pageRegistryDir", dir: ctx.pageRegistryDir },
        ];

        for (const { label, dir } of dirs) {
            if (!fs.existsSync(dir)) {
                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: `[${label}]`,
                    filePath: dir,
                });

                reportNodes.push({
                    title: label,
                    children: [
                        {
                            title: dir,
                            children: [
                                {
                                    severity: "error",
                                    title: "Missing",
                                    summary: `[${label}]`,
                                },
                            ],
                        },
                    ],
                });
            }
        }

        if (!fs.existsSync(ctx.manifestFile)) {
            issues.push({
                ruleId: this.id,
                severity: "WARN",
                issueLabel: "Missing",
                message: "[manifestFile]",
                filePath: ctx.manifestFile,
            });

            reportNodes.push({
                title: "manifest",
                children: [
                    {
                        title: ctx.manifestFile,
                        children: [
                            {
                                severity: "warning",
                                title: "Missing",
                                summary: "[manifestFile]",
                            },
                        ],
                    },
                ],
            });
        }

        if (fs.existsSync(ctx.mapsDir) && listPageMapFiles(ctx.mapsDir).length === 0) {
            issues.push({
                ruleId: this.id,
                severity: "ERROR",
                issueLabel: "Missing",
                message: "[pageMaps]",
                filePath: ctx.mapsDir,
            });

            reportNodes.push({
                title: "maps",
                children: [
                    {
                        title: ctx.mapsDir,
                        children: [
                            {
                                severity: "error",
                                title: "Missing",
                                summary: "[pageMaps]",
                            },
                        ],
                    },
                ],
            });
        }

        return { issues, reportNodes };
    },
};