// src/toolingLayer/pageActions/validator/validate/rules/source/checkPageObjectManifestEntries.ts

import fs from "node:fs";
import path from "node:path";
import { PAGE_MANIFEST_DIR } from "@utils/paths";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import {
    loadPageObjectManifestIndex,
    loadPageObjectManifestPage,
} from "@toolingLayer/pageActions/common";

export function checkPageObjectManifestEntries(): ValidationCheckResult {
    try {
        const index = loadPageObjectManifestIndex();
        const issues: ValidationNode[] = [];

        for (const [pageKey, relativePath] of Object.entries(index.pages)) {
            const entryPath = path.join(PAGE_MANIFEST_DIR, relativePath);

            if (!fs.existsSync(entryPath)) {
                issues.push({
                    severity: "error",
                    title: pageKey,
                    children: [
                        {
                            severity: "error",
                            title: path.basename(relativePath),
                            summary: "missing manifest entry",
                        },
                    ],
                });
                continue;
            }

            try {
                const page = loadPageObjectManifestPage(relativePath);
                const hasScope =
                    !!page.scope?.platform &&
                    !!page.scope?.application &&
                    !!page.scope?.product &&
                    !!page.scope?.name;

                if (!hasScope || !fs.existsSync(page.paths.pageObjectFile)) {
                    issues.push({
                        severity: "error",
                        title: pageKey,
                        children: [
                            {
                                severity: "error",
                                title: path.basename(relativePath),
                                summary: !hasScope
                                    ? "invalid scope"
                                    : "missing pageObjectFile",
                            },
                        ],
                    });
                }
            } catch {
                issues.push({
                    severity: "error",
                    title: pageKey,
                    children: [
                        {
                            severity: "error",
                            title: path.basename(relativePath),
                            summary: "invalid manifest entry json",
                        },
                    ],
                });
            }
        };

        return {
            id: "checkPageObjectManifestEntries",
            severity: issues.length === 0 ? "success" : "error",
            summary: issues.length === 0 ? "no issues" : `${issues.length} issue(s)`,
            nodes: issues,
        };
    } catch {
        return {
            id: "checkPageObjectManifestEntries",
            severity: "error",
            summary: "unable to inspect pageObjects manifest entries",
        };
    }
}
