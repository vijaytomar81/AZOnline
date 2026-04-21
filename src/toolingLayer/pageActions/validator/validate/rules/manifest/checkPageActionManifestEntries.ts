// src/toolingLayer/pageActions/validator/validate/rules/manifest/checkPageActionManifestEntries.ts

import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import { buildExpectedActionState } from "../../../shared/expectedActionState";
import { loadPageActionManifestEntry } from "../../../shared/loadPageActionManifestEntry";
import { loadPageActionManifestIndex } from "../../../shared/loadPageActionManifestIndex";
import { loadPageObjectManifestPage } from "../../../shared/loadPageObjectManifestPage";

export function checkPageActionManifestEntries(): ValidationCheckResult {
    try {
        const index = loadPageActionManifestIndex();
        const issues: ValidationNode[] = [];

        Object.entries(index.actions).forEach(([pageKey, relativePath]) => {
            try {
                const actual = loadPageActionManifestEntry(relativePath);
                const page = loadPageObjectManifestPage(
                    relativePath.replace(/\.action\.json$/, ".json")
                );
                const expected = buildExpectedActionState(page).manifestEntry;

                const mismatches: ValidationNode[] = [];

                if (actual.pageKey !== expected.pageKey) {
                    mismatches.push({
                        severity: "error",
                        title: "pageKey",
                        summary: `${actual.pageKey} != ${expected.pageKey}`,
                    });
                }

                if (actual.actionKey !== expected.actionKey) {
                    mismatches.push({
                        severity: "error",
                        title: "actionKey",
                        summary: `${actual.actionKey} != ${expected.actionKey}`,
                    });
                }

                if (actual.actionName !== expected.actionName) {
                    mismatches.push({
                        severity: "error",
                        title: "actionName",
                        summary: `${actual.actionName} != ${expected.actionName}`,
                    });
                }

                if (
                    JSON.stringify(actual.scope) !== JSON.stringify(expected.scope)
                ) {
                    mismatches.push({
                        severity: "error",
                        title: "scope",
                        summary: "scope mismatch",
                    });
                }

                if (
                    JSON.stringify(actual.paths) !== JSON.stringify(expected.paths)
                ) {
                    mismatches.push({
                        severity: "error",
                        title: "paths",
                        summary: "paths mismatch",
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
                            summary: "invalid manifest entry",
                        },
                    ],
                });
            }
        });

        return {
            id: "checkPageActionManifestEntries",
            severity: issues.length === 0 ? "success" : "error",
            summary: issues.length === 0 ? "no issues" : `${issues.length} issue(s)`,
            nodes: issues,
        };
    } catch {
        return {
            id: "checkPageActionManifestEntries",
            severity: "error",
            summary: "unable to inspect pageActions manifest entries",
        };
    }
}
