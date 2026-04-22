// src/toolingLayer/pageActions/validator/validate/rules/manifest/checkActionFilePathMatchesManifest.ts

import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import {
    buildExpectedActionState,
    loadPageActionManifestEntry,
    loadPageActionManifestIndex,
    loadPageObjectManifestPage,
} from "@toolingLayer/pageActions/common";

export function checkActionFilePathMatchesManifest(): ValidationCheckResult {
    try {
        const index = loadPageActionManifestIndex();
        const issues: ValidationNode[] = [];

        for (const [pageKey, relativePath] of Object.entries(index.actions)) {
            try {
                const actionEntry = loadPageActionManifestEntry(relativePath);
                const page = loadPageObjectManifestPage(
                    relativePath.replace(/\.action\.json$/, ".json")
                );
                const expected = buildExpectedActionState(page).manifestEntry.paths;
                const actual = actionEntry.paths;

                const mismatches: ValidationNode[] = [];

                if (actual.actionFile !== expected.actionFile) {
                    mismatches.push({
                        severity: "error",
                        title: "actionFile",
                        summary: `${actual.actionFile} != ${expected.actionFile}`,
                    });
                }

                if (actual.productIndexFile !== expected.productIndexFile) {
                    mismatches.push({
                        severity: "error",
                        title: "productIndexFile",
                        summary: `${actual.productIndexFile} != ${expected.productIndexFile}`,
                    });
                }

                if (actual.applicationIndexFile !== expected.applicationIndexFile) {
                    mismatches.push({
                        severity: "error",
                        title: "applicationIndexFile",
                        summary: `${actual.applicationIndexFile} != ${expected.applicationIndexFile}`,
                    });
                }

                if (actual.platformIndexFile !== expected.platformIndexFile) {
                    mismatches.push({
                        severity: "error",
                        title: "platformIndexFile",
                        summary: `${actual.platformIndexFile} != ${expected.platformIndexFile}`,
                    });
                }

                if (actual.actionsIndexFile !== expected.actionsIndexFile) {
                    mismatches.push({
                        severity: "error",
                        title: "actionsIndexFile",
                        summary: `${actual.actionsIndexFile} != ${expected.actionsIndexFile}`,
                    });
                }

                if (actual.rootIndexFile !== expected.rootIndexFile) {
                    mismatches.push({
                        severity: "error",
                        title: "rootIndexFile",
                        summary: `${actual.rootIndexFile} != ${expected.rootIndexFile}`,
                    });
                }

                if (mismatches.length > 0) {
                    issues.push({
                        severity: "error",
                        title: pageKey,
                        children: mismatches,
                    });
                }
            } catch {
                issues.push({
                    severity: "error",
                    title: pageKey,
                    children: [
                        {
                            severity: "error",
                            title: relativePath,
                            summary: "unable to compare manifest paths",
                        },
                    ],
                });
            }
        };

        return {
            id: "checkActionFilePathMatchesManifest",
            severity: issues.length === 0 ? "success" : "error",
            summary: issues.length === 0 ? "no issues" : `${issues.length} issue(s)`,
            nodes: issues,
        };
    } catch {
        return {
            id: "checkActionFilePathMatchesManifest",
            severity: "error",
            summary: "unable to inspect manifest action paths",
        };
    }
}
