// src/toolingLayer/businessJourneys/validator/validate/rules/journeys/checkNoOrphanJourneyFiles.ts

import path from "node:path";
import { BUSINESS_JOURNEYS_DIR, toRepoRelative } from "@utils/paths";
import type {
    ValidationCheckResult,
    ValidationNode,
} from "../../pipeline/types";
import {
    buildJourneyRunnerFile,
    loadExpectedJourneyTargets,
    walkJourneyRunnerFiles,
} from "./shared";

export function checkNoOrphanJourneyFiles(): ValidationCheckResult {
    const expectedFiles = new Set(
        loadExpectedJourneyTargets().map((target) =>
            path.normalize(buildJourneyRunnerFile(target))
        )
    );

    const issues: ValidationNode[] = walkJourneyRunnerFiles()
        .map((file) => path.normalize(file))
        .filter((file) => !expectedFiles.has(file))
        .filter((file) => !file.includes(`${path.sep}runtime${path.sep}`))
        .filter((file) => !file.includes(`${path.sep}framework${path.sep}`))
        .map((file) => ({
            severity: "warning",
            title: toRepoRelative(file),
            summary: "orphan journey runner file",
        }));

    return {
        id: "checkNoOrphanJourneyFiles",
        severity: issues.length === 0 ? "success" : "warning",
        summary:
            issues.length === 0
                ? "no issues"
                : `${issues.length} orphan file(s)`,
        nodes: issues,
    };
}
