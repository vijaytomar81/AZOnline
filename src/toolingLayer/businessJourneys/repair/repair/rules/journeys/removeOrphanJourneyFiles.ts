// src/toolingLayer/businessJourneys/repair/repair/rules/journeys/removeOrphanJourneyFiles.ts

import path from "node:path";
import { toRepoRelative } from "@utils/paths";
import {
    buildJourneyRunnerFile,
    loadExpectedJourneyTargets,
    walkJourneyRunnerFiles,
} from "@toolingLayer/businessJourneys/validator/validate/rules/journeys/shared";
import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

export function removeOrphanJourneyFiles(
    _context: RepairContext
): RepairRuleResult {
    const expectedFiles = new Set(
        loadExpectedJourneyTargets().map((target) =>
            path.normalize(buildJourneyRunnerFile(target))
        )
    );

    const orphanFiles = walkJourneyRunnerFiles()
        .map((file) => path.normalize(file))
        .filter((file) => !expectedFiles.has(file))
        .filter((file) => !file.includes(`${path.sep}runtime${path.sep}`))
        .filter((file) => !file.includes(`${path.sep}framework${path.sep}`));

    return {
        group: "journeys",
        name: "removeOrphanJourneyFiles",
        status: orphanFiles.length > 0 ? "warning" : "unchanged",
        created: 0,
        updated: 0,
        removed: 0,
        unchanged: orphanFiles.length > 0 ? 0 : 1,
        warning: orphanFiles.length > 0 ? 1 : 0,
        failed: 0,
        filesCreated: 0,
        filesUpdated: 0,
        filesRemoved: 0,
        details: orphanFiles.map((file) => ({
            message: `manual review required: ${toRepoRelative(file)}`,
        })),
    };
}
