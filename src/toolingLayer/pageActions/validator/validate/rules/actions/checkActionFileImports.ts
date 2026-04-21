// src/toolingLayer/pageActions/validator/validate/rules/actions/checkActionFileImports.ts

import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import { buildExpectedActionState } from "../../../shared/expectedActionState";
import { loadPageObjectManifestIndex } from "../../../shared/loadPageObjectManifestIndex";
import { loadPageObjectManifestPage } from "../../../shared/loadPageObjectManifestPage";
import { readTextIfExists } from "../../../shared/readTextIfExists";

function hasImport(text: string, token: string): boolean {
    return text.includes(token);
}

export function checkActionFileImports(): ValidationCheckResult {
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

            const missing: ValidationNode[] = [];

            if (
                !hasImport(
                    text,
                    'import type { PageAction } from "@businessLayer/pageActions/shared";'
                )
            ) {
                missing.push({
                    severity: "error",
                    title: expected.actionFileName,
                    summary: "missing PageAction type import",
                });
            }

            if (text.includes("requireRecordValue(") &&
                !hasImport(text, "requireRecordValue")) {
                missing.push({
                    severity: "error",
                    title: expected.actionFileName,
                    summary: "missing requireRecordValue import",
                });
            }

            if (text.includes("requireStringValue(") &&
                !hasImport(text, "requireStringValue")) {
                missing.push({
                    severity: "error",
                    title: expected.actionFileName,
                    summary: "missing requireStringValue import",
                });
            }

            if (text.includes("logPageActionInfo(") &&
                !hasImport(text, "logPageActionInfo")) {
                missing.push({
                    severity: "error",
                    title: expected.actionFileName,
                    summary: "missing logPageActionInfo import",
                });
            }

            if (missing.length > 0) {
                issues.push({
                    severity: "error",
                    title: pageKey,
                    children: missing,
                });
            }
        });

        return {
            id: "checkActionFileImports",
            severity: issues.length === 0 ? "success" : "error",
            summary: issues.length === 0 ? "no issues" : `${issues.length} issue(s)`,
            nodes: issues,
        };
    } catch {
        return {
            id: "checkActionFileImports",
            severity: "error",
            summary: "unable to inspect action file imports",
        };
    }
}
