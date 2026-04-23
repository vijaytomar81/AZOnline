// src/toolingLayer/pageActions/validator/validate/rules/actions/checkActionFilesExist.ts

import fs from "node:fs";
import path from "node:path";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import {
    buildExpectedActionState,
    loadPageObjectManifestIndex,
    loadPageObjectManifestPage,
} from "@toolingLayer/pageActions/common";

export function checkActionFilesExist(): ValidationCheckResult {
    try {
        const index = loadPageObjectManifestIndex();
        const issues: ValidationNode[] = [];

        for (const [pageKey, relativePath] of Object.entries(index.pages)) {
            const page = loadPageObjectManifestPage(relativePath);
            const expected = buildExpectedActionState(page);

            if (!fs.existsSync(expected.actionFilePath)) {
                issues.push({
                    severity: "error",
                    title: pageKey,
                    children: [
                        {
                            severity: "error",
                            title: path.basename(expected.actionFilePath),
                            summary: "missing",
                        },
                    ],
                });
            }
        };

        return {
            id: "checkActionFilesExist",
            severity: issues.length === 0 ? "success" : "error",
            summary: issues.length === 0 ? "no issues" : `${issues.length} missing file(s)`,
            nodes: issues,
        };
    } catch {
        return {
            id: "checkActionFilesExist",
            severity: "error",
            summary: "unable to inspect action files",
        };
    }
}
