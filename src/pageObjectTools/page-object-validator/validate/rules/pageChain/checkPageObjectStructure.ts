// src/pageObjectTools/page-object-validator/validate/rules/pageChain/checkPageObjectStructure.ts

import fs from "node:fs";

import type { TreeNode } from "@utils/cliTree";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { getPageArtifactPaths } from "../../../../page-object-common/pagePaths";
import { loadAllPageMaps } from "../../../../page-object-common/readPageMap";

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

function hasBasePageImport(pageObjectTs: string): boolean {
    return pageObjectTs.includes(`import { BasePage } from "@automation/base";`);
}

function hasAliasesImport(pageObjectTs: string): boolean {
    return pageObjectTs.includes(`import { aliases, aliasKeys } from "./aliases";`);
}

function hasPageMetaImport(pageObjectTs: string): boolean {
    return pageObjectTs.includes(`import { pageMeta } from "./aliases.generated";`);
}

function hasPageKeyConstant(pageObjectTs: string, pageKey: string): boolean {
    return pageObjectTs.includes(`const PAGE_KEY = ${JSON.stringify(pageKey)} as const;`);
}

function hasClassDeclaration(pageObjectTs: string, className: string): boolean {
    return pageObjectTs.includes(`export class ${className} extends BasePage`);
}

function hasClickAliasKeyHelper(pageObjectTs: string): boolean {
    return pageObjectTs.includes(`protected async clickAliasKey(aliasKey: keyof typeof aliases)`);
}

function hasFillAliasKeyHelper(pageObjectTs: string): boolean {
    return pageObjectTs.includes(`protected async fillAliasKey(aliasKey: keyof typeof aliases, value: string)`);
}

function hasSelectAliasKeyHelper(pageObjectTs: string): boolean {
    return pageObjectTs.includes(`protected async selectAliasKey(aliasKey: keyof typeof aliases, value: string)`);
}

function hasSetCheckedAliasKeyHelper(pageObjectTs: string): boolean {
    return pageObjectTs.includes(
        `protected async setCheckedAliasKey(aliasKey: keyof typeof aliases, checked: boolean = true)`
    );
}

export const checkPageObjectStructure: ValidationRule = {
    id: "pageChain.checkPageObjectStructure",
    description: "Validate page object structure and managed alias markers",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const artifact = getPageArtifactPaths(
                ctx.pageObjectsDir,
                item.pageMap.pageKey
            );

            if (!fs.existsSync(artifact.pageObjectPath)) {
                continue;
            }

            const pageObjectTs = fs.readFileSync(artifact.pageObjectPath, "utf8");
            const missingItems: string[] = [];

            if (!pageObjectTs.includes("// <scanner:aliases>")) {
                missingItems.push("openingMarker");
            }

            if (!pageObjectTs.includes("// </scanner:aliases>")) {
                missingItems.push("closingMarker");
            }

            if (!hasBasePageImport(pageObjectTs)) {
                missingItems.push("basePageImport");
            }

            if (!hasAliasesImport(pageObjectTs)) {
                missingItems.push("aliasesImport");
            }

            if (!hasPageMetaImport(pageObjectTs)) {
                missingItems.push("pageMetaImport");
            }

            if (!hasPageKeyConstant(pageObjectTs, item.pageMap.pageKey)) {
                missingItems.push("pageKeyConstant");
            }

            if (!hasClassDeclaration(pageObjectTs, artifact.className)) {
                missingItems.push("classDeclaration");
            }

            if (!hasClickAliasKeyHelper(pageObjectTs)) {
                missingItems.push("clickAliasKeyHelper");
            }

            if (!hasFillAliasKeyHelper(pageObjectTs)) {
                missingItems.push("fillAliasKeyHelper");
            }

            if (!hasSelectAliasKeyHelper(pageObjectTs)) {
                missingItems.push("selectAliasKeyHelper");
            }

            if (!hasSetCheckedAliasKeyHelper(pageObjectTs)) {
                missingItems.push("setCheckedAliasKeyHelper");
            }

            if (missingItems.length === 0) {
                continue;
            }

            issues.push({
                ruleId: this.id,
                severity: "ERROR",
                issueLabel: "Missing",
                message: formatKeyList(missingItems),
                pageKey: item.pageMap.pageKey,
                filePath: artifact.pageObjectPath,
            });

            reportNodes.push({
                title: item.pageMap.pageKey,
                children: [
                    {
                        title: artifact.className + ".ts".replace(".ts.ts", ".ts"),
                        children: [
                            {
                                severity: "error",
                                title: "Missing",
                                summary: formatKeyList(missingItems),
                            },
                        ],
                    },
                ],
            });
        }

        return { issues, reportNodes };
    },
};