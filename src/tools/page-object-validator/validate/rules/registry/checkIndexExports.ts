// src/tools/page-object-validator/validate/rules/registry/checkIndexExports.ts

import fs from "node:fs";

import type { TreeNode } from "@/utils/cliTree";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { getIndexFile } from "../../shared/pagePaths";
import { loadAllPageMaps } from "../../shared/readPageMap";

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

function expectedImportPath(pageKey: string, className: string): string {
    return `@page-objects/${pageKey.split(".").join("/")}/${className}`;
}

function expectedClassName(pageKey: string): string {
    const last = pageKey.split(".").slice(-1)[0] || "Page";
    const parts = last
        .split(/[-_.\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

    return `${parts.join("")}Page`;
}

function extractExportPaths(tsText: string): Set<string> {
    const paths = new Set<string>();
    const re = /export\s+\*\s+from\s+"([^"]+)";/g;

    let match: RegExpExecArray | null;
    while ((match = re.exec(tsText))) {
        if (match[1]) paths.add(match[1]);
    }

    return paths;
}

function pageKeyFromImportPath(importPath: string): string {
    const match = importPath.match(/^@page-objects\/(.+)\/[^/]+$/);
    return match?.[1]?.replace(/\//g, ".") ?? importPath;
}

export const checkIndexExports: ValidationRule = {
    id: "registry.checkIndexExports",
    description: "Validate src/pages/index.ts exports all actual page objects",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];
        const indexFile = getIndexFile(ctx.pageRegistryDir);

        if (!fs.existsSync(indexFile)) {
            return {
                issues: [{
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: "[index.ts]",
                    filePath: indexFile,
                }],
                reportNodes: [
                    {
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
                    },
                ],
            };
        }

        const indexTs = fs.readFileSync(indexFile, "utf8");
        const actualExportPaths = extractExportPaths(indexTs);

        const expectedByPageKey = new Map<string, string>();
        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const className = expectedClassName(item.pageMap.pageKey);
            expectedByPageKey.set(
                item.pageMap.pageKey,
                expectedImportPath(item.pageMap.pageKey, className)
            );
        }

        const missingByPage = new Map<string, string[]>();
        const extraByPage = new Map<string, string[]>();

        for (const [pageKey, importPath] of expectedByPageKey.entries()) {
            if (!actualExportPaths.has(importPath)) {
                const current = missingByPage.get(pageKey) ?? [];
                current.push(importPath);
                missingByPage.set(pageKey, current);

                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: formatKeyList([importPath]),
                    pageKey,
                    filePath: indexFile,
                });
            }
        }

        const expectedPaths = new Set(expectedByPageKey.values());
        for (const actualPath of actualExportPaths) {
            if (!expectedPaths.has(actualPath)) {
                const pageKey = pageKeyFromImportPath(actualPath);
                const current = extraByPage.get(pageKey) ?? [];
                current.push(actualPath);
                extraByPage.set(pageKey, current);

                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Extra",
                    message: formatKeyList([actualPath]),
                    pageKey,
                    filePath: indexFile,
                });
            }
        }

        const allPageKeys = new Set<string>([
            ...missingByPage.keys(),
            ...extraByPage.keys(),
        ]);

        for (const pageKey of [...allPageKeys].sort((a, b) => a.localeCompare(b))) {
            const children: TreeNode[] = [];
            const missing = missingByPage.get(pageKey) ?? [];
            const extra = extraByPage.get(pageKey) ?? [];

            if (missing.length > 0) {
                children.push({
                    severity: "error",
                    title: "Missing",
                    summary: formatKeyList(missing),
                });
            }

            if (extra.length > 0) {
                children.push({
                    severity: "warning",
                    title: "Extra",
                    summary: formatKeyList(extra),
                });
            }

            reportNodes.push({
                title: pageKey,
                children: [
                    {
                        title: "index.ts",
                        children,
                    },
                ],
            });
        }

        return { issues, reportNodes };
    },
};