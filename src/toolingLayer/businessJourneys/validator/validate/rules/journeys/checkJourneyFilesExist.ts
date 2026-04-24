// src/toolingLayer/businessJourneys/validator/validate/rules/journeys/checkJourneyFilesExist.ts

import fs from "node:fs";
import { toRepoRelative } from "@utils/paths";
import type {
    ValidationCheckResult,
    ValidationNode,
} from "../../pipeline/types";
import {
    buildJourneyIndexFile,
    buildJourneyRunnerFile,
    loadExpectedJourneyTargets,
} from "./shared";

export function checkJourneyFilesExist(): ValidationCheckResult {
    const issues: ValidationNode[] = [];

    for (const target of loadExpectedJourneyTargets()) {
        const files = [
            buildJourneyIndexFile(target),
            buildJourneyRunnerFile(target),
        ];

        for (const file of files) {
            if (!fs.existsSync(file)) {
                issues.push({
                    severity: "error",
                    title: toRepoRelative(file),
                    summary: "missing journey file",
                });
            }
        }
    }

    return {
        id: "checkJourneyFilesExist",
        severity: issues.length === 0 ? "success" : "error",
        summary:
            issues.length === 0
                ? "no issues"
                : `${issues.length} missing file(s)`,
        nodes: issues,
    };
}
