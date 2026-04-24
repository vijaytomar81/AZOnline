// src/toolingLayer/businessJourneys/repair/repair/rules/framework/repairFrameworkFiles.ts

import { ensureFrameworkFiles } from "@toolingLayer/businessJourneys/generator/generator/write/ensureFrameworkFiles";
import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

export function repairFrameworkFiles(
    _context: RepairContext
): RepairRuleResult {
    const result = ensureFrameworkFiles();

    const changed = result.filesCreated + result.filesUpdated;

    return {
        group: "framework",
        name: "repairFrameworkFiles",
        status:
            result.filesCreated > 0
                ? "created"
                : result.filesUpdated > 0
                  ? "updated"
                  : "unchanged",
        created: result.filesCreated > 0 ? 1 : 0,
        updated: result.filesUpdated > 0 ? 1 : 0,
        removed: 0,
        unchanged: changed === 0 ? 1 : 0,
        warning: 0,
        failed: 0,
        filesCreated: result.filesCreated,
        filesUpdated: result.filesUpdated,
        filesRemoved: 0,
        details: result.changes
            .filter((change) => change.status !== "unchanged")
            .map((change) => ({
                message: `${change.status}: ${change.fileName}`,
            })),
    };
}
