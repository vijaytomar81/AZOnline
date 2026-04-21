// src/toolingLayer/pageActions/validator/validate/rules/actions/checkActionExports.ts

import path from "node:path";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import { buildExpectedActionState } from "../../../shared/expectedActionState";
import { loadPageObjectManifestIndex } from "../../../shared/loadPageObjectManifestIndex";
import { loadPageObjectManifestPage } from "../../../shared/loadPageObjectManifestPage";
import { readTextIfExists } from "../../../shared/readTextIfExists";

export function checkActionExports(): ValidationCheckResult {
    try {
        const index = loadPageObjectManifestIndex();
        const issues: ValidationNode[] = [];

        Object.entries(index.pages).forEach(([pageKey, relativePath]) => {
            const page = loadPageObjectManifestPage(relativePath);
            const expected = buildExpectedActionState(page);
            const text = readTextIfExists(expected.actionFilePath);

            if (!text) {
                return;
            }

            const firstLine = text.split("\n")[0] ?? "";
            const hasHeader = firstLine === `// ${expected.actionFileRepoRelative}`;
            const hasPageActionImport = text.includes(
                'import type { PageAction } from "@businessLayer/pageActions/shared";'
            );
            const hasExport = text.includes(
                `export const ${expected.actionName}: PageAction = async ({`
            );

            if (!hasHeader || !hasPageActionImport || !hasExport) {
                const children: ValidationNode[] = [];

                if (!hasHeader) {
                    children.push({
                        severity: "error",
                        title: path.basename(expected.actionFilePath),
                        summary: "invalid file header",
                    });
                }

                if (!hasPageActionImport) {
                    children.push({
                        severity: "error",
                        title: path.basename(expected.actionFilePath),
                        summary: "missing PageAction import",
                    });
                }

                if (!hasExport) {
                    children.push({
                        severity: "error",
                        title: path.basename(expected.actionFilePath),
                        summary: "missing expected action export",
                    });
                }

                issues.push({
                    severity: "error",
                    title: pageKey,
                    children,
                });
            }
        });

        return {
            id: "checkActionExports",
            severity: issues.length === 0 ? "success" : "error",
            summary: issues.length === 0 ? "no issues" : `${issues.length} issue(s)`,
            nodes: issues,
        };
    } catch {
        return {
            id: "checkActionExports",
            severity: "error",
            summary: "unable to inspect action exports",
        };
    }
}
