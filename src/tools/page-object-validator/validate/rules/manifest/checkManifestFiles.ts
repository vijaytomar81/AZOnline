// src/tools/page-object-validator/validate/rules/manifest/checkManifestFiles.ts

import fs from "node:fs";
import path from "node:path";

import type { TreeNode } from "@/utils/cliTree";
import { loadPageManifest } from "@/tools/page-object-generator/generator/pageManifest";
import type { ValidationRule } from "../../pipeline/types";
import type { ValidationIssue } from "../../types";

function formatKeyList(keys: string[]): string {
    return `[${keys.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

function manifestFileName(manifestFile: string): string {
    return path.basename(manifestFile);
}

type ManifestFileField =
    | "pageObjectFile"
    | "elementsFile"
    | "aliasesGeneratedFile"
    | "aliasesFile"
    | "pageMapFile";

export const checkManifestFiles: ValidationRule = {
    id: "manifest.checkManifestFiles",
    description: "Validate manifest file paths point to real files",
    run(ctx) {
        const issues: ValidationIssue[] = [];
        const reportNodes: TreeNode[] = [];

        const manifest = loadPageManifest(ctx.manifestFile);

        for (const entry of Object.values(manifest.pages)) {
            const missingItems: string[] = [];

            const fileFields: Array<[ManifestFileField, string | undefined]> = [
                ["pageObjectFile", entry.pageObjectFile],
                ["elementsFile", entry.elementsFile],
                ["aliasesGeneratedFile", entry.aliasesGeneratedFile],
                ["aliasesFile", entry.aliasesFile],
                ["pageMapFile", entry.pageMapFile],
            ];

            for (const [fieldName, relPath] of fileFields) {
                if (!relPath || typeof relPath !== "string" || !relPath.trim()) {
                    missingItems.push(fieldName);
                    continue;
                }

                const absPath = path.join(process.cwd(), relPath);
                if (!fs.existsSync(absPath)) {
                    missingItems.push(fieldName);
                }
            }

            if (missingItems.length > 0) {
                issues.push({
                    ruleId: this.id,
                    severity: "WARN",
                    issueLabel: "Missing",
                    message: formatKeyList(missingItems),
                    pageKey: entry.pageKey,
                    filePath: ctx.manifestFile,
                });

                reportNodes.push({
                    title: entry.pageKey,
                    children: [
                        {
                            title: manifestFileName(ctx.manifestFile),
                            children: [
                                {
                                    severity: "warning",
                                    title: "Missing",
                                    summary: formatKeyList(missingItems),
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