// src/toolingLayer/businessJourneys/validator/validate/rules/framework/checkRootIndexExports.ts

import fs from "node:fs";
import path from "node:path";
import {
    BUSINESS_JOURNEYS_DIR,
    toRepoRelative,
} from "@utils/paths";
import type {
    ValidationCheckResult,
    ValidationNode,
} from "../../pipeline/types";

export function checkRootIndexExports(): ValidationCheckResult {
    const filePath = path.join(BUSINESS_JOURNEYS_DIR, "index.ts");

    const expectedLines = [
        'export * from "./framework";',
        'export * from "./runtime";',
    ];

    const issues: ValidationNode[] = [];

    if (!fs.existsSync(filePath)) {
        issues.push({
            severity: "error",
            title: toRepoRelative(filePath),
            summary: "missing root index file",
        });
    } else {
        const content = fs.readFileSync(filePath, "utf8");

        expectedLines
            .filter((line) => !content.includes(line))
            .forEach((line) => {
                issues.push({
                    severity: "error",
                    title: toRepoRelative(filePath),
                    summary: `missing export: ${line}`,
                });
            });
    }

    return {
        id: "checkRootIndexExports",
        severity: issues.length === 0 ? "success" : "error",
        summary: issues.length === 0 ? "no issues" : `${issues.length} issue(s)`,
        nodes: issues,
    };
}
