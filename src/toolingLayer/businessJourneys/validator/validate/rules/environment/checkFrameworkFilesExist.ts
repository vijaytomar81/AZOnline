// src/toolingLayer/businessJourneys/validator/validate/rules/environment/checkFrameworkFilesExist.ts

import fs from "node:fs";
import path from "node:path";
import {
    BUSINESS_JOURNEYS_DIR,
    toRepoRelative,
} from "@utils/paths";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";

export function checkFrameworkFilesExist(): ValidationCheckResult {
    const files = [
        path.join(BUSINESS_JOURNEYS_DIR, "framework", "types.ts"),
        path.join(BUSINESS_JOURNEYS_DIR, "framework", "runJourney.ts"),
        path.join(BUSINESS_JOURNEYS_DIR, "framework", "index.ts"),
    ];

    const issues: ValidationNode[] = files
        .filter((file) => !fs.existsSync(file))
        .map((file) => ({
            severity: "error",
            title: toRepoRelative(file),
            summary: "missing framework file",
        }));

    return {
        id: "checkFrameworkFilesExist",
        severity: issues.length === 0 ? "success" : "error",
        summary: issues.length === 0 ? "no issues" : `${issues.length} missing file(s)`,
        nodes: issues,
    };
}
