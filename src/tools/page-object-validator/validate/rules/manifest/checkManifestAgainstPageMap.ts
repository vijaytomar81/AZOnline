// src/tools/page-object-validator/validate/rules/manifest/checkManifestAgainstPageMap.ts

import path from "node:path";

import type { TreeNode } from "@/utils/cliTree";
import { loadPageManifest } from "@/tools/page-object-generator/generator/pageManifest";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { getPageArtifactPaths } from "../../shared/pagePaths";
import { loadAllPageMaps } from "../../shared/readPageMap";

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

function formatMismatchList(items: string[]): string {
    return `[${items.join(", ")}]`;
}

function manifestFileName(manifestFile: string): string {
    return path.basename(manifestFile);
}

function normalizeValue(value: unknown): string {
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (typeof value === "string") return value;
    return JSON.stringify(value);
}

function mismatchText(field: string, actualValue: unknown, expectedValue: unknown): string {
    return `${field} → actual: ${normalizeValue(actualValue)}, expected: ${normalizeValue(expectedValue)}`;
}

export const checkManifestAgainstPageMap: ValidationRule = {
    id: "manifest.checkManifestAgainstPageMap",
    description: "Validate manifest entries against page-map content",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        const manifest = loadPageManifest(ctx.manifestFile);
        const validPageKeys = new Set<string>();

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            validPageKeys.add(item.pageMap.pageKey);

            const entry = manifest.pages[item.pageMap.pageKey];
            const artifact = getPageArtifactPaths(ctx.pageObjectsDir, item.pageMap.pageKey);

            const missingItems: string[] = [];
            const mismatchItems: string[] = [];

            if (!entry) {
                missingItems.push("manifestEntryKey");
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Missing",
                    message: "[manifestEntryKey]",
                    pageKey: item.pageMap.pageKey,
                    filePath: ctx.manifestFile,
                });
            } else {
                if (entry.className !== artifact.className) {
                    mismatchItems.push(
                        mismatchText("className", entry.className, artifact.className)
                    );
                }

                const expectedElementCount = Object.keys(item.pageMap.elements ?? {}).length;
                if (entry.elementCount !== expectedElementCount) {
                    mismatchItems.push(
                        mismatchText("elementCount", entry.elementCount, expectedElementCount)
                    );
                }

                const expectedUrlPath = item.pageMap.urlPath ?? undefined;
                if ((entry.urlPath ?? undefined) !== expectedUrlPath) {
                    mismatchItems.push(
                        mismatchText("urlPath", entry.urlPath, expectedUrlPath)
                    );
                }

                const expectedTitle = item.pageMap.title ?? undefined;
                if ((entry.title ?? undefined) !== expectedTitle) {
                    mismatchItems.push(
                        mismatchText("title", entry.title, expectedTitle)
                    );
                }

                if (mismatchItems.length > 0) {
                    issues.push({
                        ruleId: this.id,
                        severity: "WARN",
                        issueLabel: "Mismatch",
                        message: formatMismatchList(mismatchItems),
                        pageKey: item.pageMap.pageKey,
                        filePath: ctx.manifestFile,
                    });
                }
            }

            if (missingItems.length > 0 || mismatchItems.length > 0) {
                const issueChildren: TreeNode[] = [];

                if (missingItems.length > 0) {
                    issueChildren.push({
                        severity: "warning",
                        title: "Missing",
                        summary: formatKeyList(missingItems),
                    });
                }

                if (mismatchItems.length > 0) {
                    issueChildren.push({
                        severity: "warning",
                        title: "Mismatch",
                        summary: formatMismatchList(mismatchItems),
                    });
                }

                reportNodes.push({
                    title: item.pageMap.pageKey,
                    children: [
                        {
                            title: manifestFileName(ctx.manifestFile),
                            children: issueChildren,
                        },
                    ],
                });
            }
        }

        const extraManifestKeys = Object.keys(manifest.pages).filter(
            (pageKey) => !validPageKeys.has(pageKey)
        );

        for (const pageKey of extraManifestKeys) {
            issues.push({
                ruleId: this.id,
                severity: "WARN",
                issueLabel: "Extra",
                message: "[manifestEntryKey]",
                pageKey,
                filePath: ctx.manifestFile,
            });

            reportNodes.push({
                title: pageKey,
                children: [
                    {
                        title: manifestFileName(ctx.manifestFile),
                        children: [
                            {
                                severity: "warning",
                                title: "Extra",
                                summary: "[manifestEntryKey]",
                            },
                        ],
                    },
                ],
            });
        }

        return { issues, reportNodes };
    },
};