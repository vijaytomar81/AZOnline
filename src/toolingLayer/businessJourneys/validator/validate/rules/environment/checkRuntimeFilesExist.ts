// src/toolingLayer/businessJourneys/validator/validate/rules/environment/checkRuntimeFilesExist.ts

import fs from "node:fs";
import path from "node:path";
import {
    BUSINESS_JOURNEYS_DIR,
    toRepoRelative,
} from "@utils/paths";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";

export function checkRuntimeFilesExist(): ValidationCheckResult {
    const files = [
        path.join(BUSINESS_JOURNEYS_DIR, "runtime", "resolveNewBusinessJourney.ts"),
        path.join(BUSINESS_JOURNEYS_DIR, "runtime", "runNewBusiness.ts"),
        path.join(BUSINESS_JOURNEYS_DIR, "runtime", "index.ts"),
        path.join(BUSINESS_JOURNEYS_DIR, "index.ts"),
    ];

    const issues: ValidationNode[] = files
        .filter((file) => !fs.existsSync(file))
        .map((file) => ({
            severity: "error",
            title: toRepoRelative(file),
            summary: "missing runtime/root file",
        }));

    return {
        id: "checkRuntimeFilesExist",
        severity: issues.length === 0 ? "success" : "error",
        summary: issues.length === 0 ? "no issues" : `${issues.length} missing file(s)`,
        nodes: issues,
    };
}
