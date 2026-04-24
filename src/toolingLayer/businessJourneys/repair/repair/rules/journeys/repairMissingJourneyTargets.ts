// src/toolingLayer/businessJourneys/repair/repair/rules/journeys/repairMissingJourneyTargets.ts

import { buildJourneyTargets } from "@toolingLayer/businessJourneys/generator/generator/buildJourneyTargets";
import { loadJourneyGenerationInputs } from "@toolingLayer/businessJourneys/generator/generator/loadJourneyGenerationInputs";
import { writeTargetFiles } from "@toolingLayer/businessJourneys/generator/generator/write/writeTargetFiles";
import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

export function repairMissingJourneyTargets(
    _context: RepairContext
): RepairRuleResult {
    const inputs = loadJourneyGenerationInputs();
    const targets = buildJourneyTargets(inputs);

    let filesCreated = 0;
    let filesUpdated = 0;
    let failed = 0;

    for (const target of targets) {
        const result = writeTargetFiles(target, inputs);

        filesCreated += result.filesCreated;
        filesUpdated += result.filesUpdated;

        if (result.status === "failed") {
            failed++;
        }
    }

    return {
        group: "journeys",
        name: "repairMissingJourneyTargets",
        status:
            failed > 0
                ? "failed"
                : filesCreated > 0
                  ? "created"
                  : filesUpdated > 0
                    ? "updated"
                    : "unchanged",
        created: filesCreated > 0 ? 1 : 0,
        updated: filesUpdated > 0 ? 1 : 0,
        removed: 0,
        unchanged: filesCreated === 0 && filesUpdated === 0 && failed === 0 ? 1 : 0,
        warning: 0,
        failed: failed > 0 ? 1 : 0,
        filesCreated,
        filesUpdated,
        filesRemoved: 0,
        details: [],
    };
}
