// src/toolingLayer/businessJourneys/validator/validate/rules/environment/checkEnvironment.ts

import fs from "node:fs";
import {
    BUSINESS_JOURNEYS_DIR,
    PAGE_ACTIONS_REGISTRY_DIR,
    toRepoRelative,
} from "@utils/paths";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";

export function checkEnvironment(): ValidationCheckResult {
    const requiredDirs = [
        BUSINESS_JOURNEYS_DIR,
        PAGE_ACTIONS_REGISTRY_DIR,
    ];

    const issues: ValidationNode[] = requiredDirs
        .filter((dir) => !fs.existsSync(dir))
        .map((dir) => ({
            severity: "error",
            title: toRepoRelative(dir),
            summary: "missing directory",
        }));

    return {
        id: "checkEnvironment",
        severity: issues.length === 0 ? "success" : "error",
        summary: issues.length === 0 ? "no issues" : `${issues.length} issue(s)`,
        nodes: issues,
    };
}
