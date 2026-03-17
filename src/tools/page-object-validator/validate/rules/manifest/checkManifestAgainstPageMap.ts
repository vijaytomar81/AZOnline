// src/tools/page-object-validator/validate/rules/manifest/checkManifestAgainstPageMap.ts

import path from "node:path";

import type { TreeNode } from "@/utils/cliTree";
import { loadPageManifest } from "@/tools/page-object-generator/generator/pageManifest";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";
import { getPageArtifactPaths } from "../../../../page-object-common/pagePaths";
import { loadAllPageMaps } from "../../../../page-object-common/readPageMap";

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
    return typeof value === "string" ? value : JSON.stringify(value);
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
                    mismatchItems.push(mismatchText("className", entry.className, artifact.className));
                }

                if (entry.paths.pageObjectImport !== `@page-objects/${item.pageMap.pageKey.split(".").join("/")}/${artifact.className}`) {
                    mismatchItems.push(
                        mismatchText(
                            "paths.pageObjectImport",
                            entry.paths.pageObjectImport,
                            `@page-objects/${item.pageMap.pageKey.split(".").join("/")}/${artifact.className}`
                        )
                    );
                }

                const expectedElementCount = Object.keys(item.pageMap.elements ?? {}).length;
                if (entry.elementCount !== expectedElementCount) {
                    mismatchItems.push(mismatchText("elementCount", entry.elementCount, expectedElementCount));
                }

                if ((entry.urlPath ?? undefined) !== (item.pageMap.urlPath ?? undefined)) {
                    mismatchItems.push(mismatchText("urlPath", entry.urlPath, item.pageMap.urlPath));
                }

                if ((entry.title ?? undefined) !== (item.pageMap.title ?? undefined)) {
                    mismatchItems.push(mismatchText("title", entry.title, item.pageMap.title));
                }
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

            if (missingItems.length > 0 || mismatchItems.length > 0) {
                const children: TreeNode[] = [];

                if (missingItems.length > 0) {
                    children.push({
                        severity: "warning",
                        title: "Missing",
                        summary: formatKeyList(missingItems),
                    });
                }

                if (mismatchItems.length > 0) {
                    children.push({
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
                            children,
                        },
                    ],
                });
            }
        }

        const extraManifestKeys = Object.keys(manifest.pages).filter((pageKey) => !validPageKeys.has(pageKey));
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