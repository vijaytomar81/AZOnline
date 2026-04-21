// src/toolingLayer/pageActions/validator/validate/rules/environment/checkEnvironment.ts

import fs from "node:fs";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_ACTIONS_MANIFEST_INDEX_FILE,
    PAGE_MANIFEST_INDEX_FILE,
} from "@utils/paths";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";

export function checkEnvironment(): ValidationCheckResult {
    const missing: ValidationNode[] = [];

    const required: Array<[string, string]> = [
        ["pageObjectsManifestIndex", PAGE_MANIFEST_INDEX_FILE],
        ["pageActionsDir", PAGE_ACTIONS_ACTIONS_DIR],
        ["pageActionsManifestDir", PAGE_ACTIONS_MANIFEST_DIR],
        ["pageActionsManifestIndex", PAGE_ACTIONS_MANIFEST_INDEX_FILE],
    ];

    required.forEach(([label, filePath]) => {
        if (!fs.existsSync(filePath)) {
            missing.push({
                severity: "error",
                title: label,
                summary: filePath,
            });
        }
    });

    return {
        id: "checkEnvironment",
        severity: missing.length === 0 ? "success" : "error",
        summary: missing.length === 0 ? "no issues" : `${missing.length} missing path(s)`,
        nodes: missing,
    };
}
