// src/tools/page-object-validator/validate/rules/registry/checkPageManager.ts

import fs from "node:fs";

import type { TreeNode } from "@/utils/cliTree";
import { toCamelFromText } from "@/utils/text";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { getPageManagerFile } from "../../../../page-object-common/pagePaths";
import { loadAllPageMaps } from "../../../../page-object-common/readPageMap";

function lastSegment(pageKey: string): string {
    return pageKey.split(".").slice(-1)[0] || "page";
}

function firstSegment(pageKey: string): string {
    return pageKey.split(".")[0] || "common";
}

function expectedClassName(pageKey: string): string {
    const last = pageKey.split(".").slice(-1)[0] || "Page";
    const parts = last
        .split(/[-_.\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

    return `${parts.join("")}Page`;
}

function expectedImportPath(pageKey: string, className: string): string {
    return `@page-objects/${pageKey.split(".").join("/")}/${className}`;
}

function expectedMember(pageKey: string): string {
    return toCamelFromText(lastSegment(pageKey));
}

function expectedKeyId(pageKey: string): string {
    return `${firstSegment(pageKey)}.${expectedMember(pageKey)}`;
}

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

function extractPageManagerImports(tsText: string): Map<string, string> {
    const imports = new Map<string, string>();
    const re = /import\s+\{\s*([A-Za-z0-9_]+)\s*\}\s+from\s+"([^"]+)";/g;

    let match: RegExpExecArray | null;
    while ((match = re.exec(tsText))) {
        const className = match[1];
        const importPath = match[2];
        if (className && importPath?.startsWith("@page-objects/")) {
            imports.set(importPath, className);
        }
    }

    return imports;
}

function extractPageManagerKeys(tsText: string): Set<string> {
    const keys = new Set<string>();
    const re = /this\.get\("([^"]+)"/g;

    let match: RegExpExecArray | null;
    while ((match = re.exec(tsText))) {
        if (match[1]) keys.add(match[1]);
    }

    return keys;
}

function pageKeyFromImportPath(importPath: string): string {
    const match = importPath.match(/^@page-objects\/(.+)\/[^/]+$/);
    return match?.[1]?.replace(/\//g, ".") ?? importPath;
}

function pageKeyFromKeyId(keyId: string): string {
    return keyId;
}

export const checkPageManager: ValidationRule = {
    id: "registry.checkPageManager",
    description: "Validate src/pages/pageManager.ts against actual page objects",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];
        const pageManagerFile = getPageManagerFile(ctx.pageRegistryDir);

        if (!fs.existsSync(pageManagerFile)) {
            return {
                issues: [{
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: "[pageManager.ts]",
                    filePath: pageManagerFile,
                }],
                reportNodes: [
                    {
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
                    },
                ],
            };
        }

        const pageManagerTs = fs.readFileSync(pageManagerFile, "utf8");
        const actualImports = extractPageManagerImports(pageManagerTs);
        const actualKeyIds = extractPageManagerKeys(pageManagerTs);

        const expectedImportByPage = new Map<string, string>();
        const expectedKeyIdByPage = new Map<string, string>();

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const pageKey = item.pageMap.pageKey;
            const className = expectedClassName(pageKey);
            expectedImportByPage.set(pageKey, expectedImportPath(pageKey, className));
            expectedKeyIdByPage.set(pageKey, expectedKeyId(pageKey));
        }

        const missingByPage = new Map<string, string[]>();
        const extraByPage = new Map<string, string[]>();

        for (const [pageKey, importPath] of expectedImportByPage.entries()) {
            if (!actualImports.has(importPath)) {
                const current = missingByPage.get(pageKey) ?? [];
                current.push(expectedClassName(pageKey));
                missingByPage.set(pageKey, current);

                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: formatKeyList([expectedClassName(pageKey)]),
                    pageKey,
                    filePath: pageManagerFile,
                });
            }
        }

        for (const [pageKey, keyId] of expectedKeyIdByPage.entries()) {
            if (!actualKeyIds.has(keyId)) {
                const current = missingByPage.get(pageKey) ?? [];
                current.push(expectedMember(pageKey));
                missingByPage.set(pageKey, current);

                issues.push({
                    ruleId: this.id,
                    severity: "ERROR",
                    issueLabel: "Missing",
                    message: formatKeyList([expectedMember(pageKey)]),
                    pageKey,
                    filePath: pageManagerFile,
                });
            }
        }

        const expectedImportPaths = new Set(expectedImportByPage.values());
        for (const actualImportPath of actualImports.keys()) {
            if (!expectedImportPaths.has(actualImportPath)) {
                const pageKey = pageKeyFromImportPath(actualImportPath);
                const current = extraByPage.get(pageKey) ?? [];
                current.push(actualImportPath);
                extraByPage.set(pageKey, current);

                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Extra",
                    message: formatKeyList([actualImportPath]),
                    pageKey,
                    filePath: pageManagerFile,
                });
            }
        }

        const expectedKeyIds = new Set(expectedKeyIdByPage.values());
        for (const actualKeyId of actualKeyIds) {
            if (!expectedKeyIds.has(actualKeyId)) {
                const pageKey = pageKeyFromKeyId(actualKeyId);
                const current = extraByPage.get(pageKey) ?? [];
                current.push(actualKeyId);
                extraByPage.set(pageKey, current);

                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Extra",
                    message: formatKeyList([actualKeyId]),
                    pageKey,
                    filePath: pageManagerFile,
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
                        title: "pageManager.ts",
                        children,
                    },
                ],
            });
        }

        return { issues, reportNodes };
    },
};