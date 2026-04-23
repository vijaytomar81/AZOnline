// src/toolingLayer/pageActions/validator/validate/rules/manifest/checkActionManifestFileExists.ts

import fs from "node:fs";
import path from "node:path";
import { PAGE_ACTIONS_MANIFEST_DIR } from "@utils/paths";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import {
    loadPageActionManifestIndex,
} from "@toolingLayer/pageActions/common";

export function checkActionManifestFileExists(): ValidationCheckResult {
    try {
        const index = loadPageActionManifestIndex();
        const issues: ValidationNode[] = [];

        for (const [pageKey, relativePath] of Object.entries(index.actions)) {
            const filePath = path.join(PAGE_ACTIONS_MANIFEST_DIR, relativePath);

            if (!fs.existsSync(filePath)) {
                issues.push({
                    severity: "error",
                    title: pageKey,
                    children: [
                        {
                            severity: "error",
                            title: relativePath,
                            summary: "missing action manifest file",
                        },
                    ],
                });
            }
        };

        return {
            id: "checkActionManifestFileExists",
            severity: issues.length === 0 ? "success" : "error",
            summary: issues.length === 0 ? "no issues" : `${issues.length} missing file(s)`,
            nodes: issues,
        };
    } catch {
        return {
            id: "checkActionManifestFileExists",
            severity: "error",
            summary: "unable to inspect pageActions manifest files",
        };
    }
}
