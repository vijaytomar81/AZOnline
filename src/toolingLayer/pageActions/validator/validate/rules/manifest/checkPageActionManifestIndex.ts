// src/toolingLayer/pageActions/validator/validate/rules/manifest/checkPageActionManifestIndex.ts

import fs from "node:fs";
import path from "node:path";
import { PAGE_ACTIONS_MANIFEST_DIR, PAGE_ACTIONS_MANIFEST_INDEX_FILE } from "@utils/paths";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import { loadPageActionManifestIndex } from "../../../shared/loadPageActionManifestIndex";

export function checkPageActionManifestIndex(): ValidationCheckResult {
    try {
        const index = loadPageActionManifestIndex();
        const issues: ValidationNode[] = [];

        Object.entries(index.actions).forEach(([pageKey, relativePath]) => {
            const filePath = path.join(PAGE_ACTIONS_MANIFEST_DIR, relativePath);

            if (!fs.existsSync(filePath)) {
                issues.push({
                    severity: "error",
                    title: pageKey,
                    children: [
                        {
                            severity: "error",
                            title: path.basename(relativePath),
                            summary: "missing manifest file",
                        },
                    ],
                });
            }
        });

        return {
            id: "checkPageActionManifestIndex",
            severity: issues.length === 0 ? "success" : "error",
            summary: issues.length === 0 ? "no issues" : `${issues.length} missing file(s)`,
            nodes: issues,
        };
    } catch {
        return {
            id: "checkPageActionManifestIndex",
            severity: "error",
            summary: "invalid pageActions manifest index",
        };
    }
}
