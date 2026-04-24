// src/toolingLayer/businessJourneys/validator/validate/rules/journeys/checkJourneyRunnerExports.ts

import fs from "node:fs";
import { toRepoRelative } from "@utils/paths";
import type {
    ValidationCheckResult,
    ValidationNode,
} from "../../pipeline/types";
import {
    buildJourneyExportName,
    buildJourneyIndexFile,
    loadExpectedJourneyTargets,
} from "./shared";

export function checkJourneyRunnerExports(): ValidationCheckResult {
    const issues: ValidationNode[] = [];

    for (const target of loadExpectedJourneyTargets()) {
        const indexFile = buildJourneyIndexFile(target);
        const exportName = buildJourneyExportName(target);
        const expectedLine = `export { ${exportName} } from "./${exportName}";`;

        if (!fs.existsSync(indexFile)) {
            continue;
        }

        const content = fs.readFileSync(indexFile, "utf8");

        if (!content.includes(expectedLine)) {
            issues.push({
                severity: "error",
                title: toRepoRelative(indexFile),
                summary: `missing export: ${expectedLine}`,
            });
        }
    }

    return {
        id: "checkJourneyRunnerExports",
        severity: issues.length === 0 ? "success" : "error",
        summary:
            issues.length === 0
                ? "no issues"
                : `${issues.length} export issue(s)`,
        nodes: issues,
    };
}
