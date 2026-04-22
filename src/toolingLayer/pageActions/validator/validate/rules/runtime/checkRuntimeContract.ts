// src/toolingLayer/pageActions/validator/validate/rules/runtime/checkRuntimeContract.ts

import fs from "node:fs";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import {
    buildExpectedActionState,
    loadPageObjectManifestIndex,
    loadPageObjectManifestPage,
} from "@toolingLayer/pageActions/common";

export function checkRuntimeContract(): ValidationCheckResult {
    try {
        const index = loadPageObjectManifestIndex();
        const issues: ValidationNode[] = [];

        for (const [pageKey, relativePath] of Object.entries(index.pages)) {
            const page = loadPageObjectManifestPage(relativePath);
            const expected = buildExpectedActionState(page);

            if (!fs.existsSync(expected.actionFilePath)) {
                continue;
            }

            const text = fs.readFileSync(expected.actionFilePath, "utf8");
            const legacyPrefixes = [
                `context.pages.${page.scope.platform}.`,
                `context.pages.${page.scope.application}.`,
            ];
            const expectedPrefix = `context.pages.${page.scope.product}.`;

            const children: ValidationNode[] = [];

            legacyPrefixes.forEach((prefix) => {
                if (text.includes(prefix)) {
                    children.push({
                        severity: "warning",
                        title: expected.actionFileName,
                        summary: `legacy accessor found: ${prefix}`,
                    });
                }
            });

            if (text.includes("context.pages.") && !text.includes(expectedPrefix)) {
                children.push({
                    severity: "warning",
                    title: expected.actionFileName,
                    summary: `expected accessor prefix: ${expectedPrefix}`,
                });
            }

            if (children.length > 0) {
                issues.push({
                    severity: "warning",
                    title: pageKey,
                    children,
                });
            }
        };

        return {
            id: "checkRuntimeContract",
            severity: issues.length === 0 ? "success" : "warning",
            summary: issues.length === 0 ? "no issues" : `${issues.length} warning(s)`,
            nodes: issues,
        };
    } catch {
        return {
            id: "checkRuntimeContract",
            severity: "error",
            summary: "unable to inspect runtime contract",
        };
    }
}
