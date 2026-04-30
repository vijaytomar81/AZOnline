// src/toolingLayer/businessJourneys/repair/repair/rules/journeys/repairJourneyExports.ts

import fs from "node:fs";
import { writeFileAlways } from "@toolingLayer/businessJourneys/generator/generator/write/writeFileAlways";
import { renderIndexFile } from "@toolingLayer/businessJourneys/generator/generator/render/renderIndexFile";
import {
    buildJourneyExportNameForTarget,
    buildJourneyIndexFile,
    loadExpectedJourneyTargets,
} from "@toolingLayer/businessJourneys/validator/validate/rules/journeys/shared";
import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

export function repairJourneyExports(
    _context: RepairContext
): RepairRuleResult {
    let filesCreated = 0;
    let filesUpdated = 0;

    for (const target of loadExpectedJourneyTargets()) {
        const indexFile = buildJourneyIndexFile(target);
        const existedBefore = fs.existsSync(indexFile);
        const exportName = buildJourneyExportNameForTarget(target);

        const changed = writeFileAlways(
            indexFile,
            renderIndexFile({
                filePath: indexFile,
                exports: [
                    {
                        exportName,
                        from: exportName,
                    },
                ],
            })
        );

        if (!changed) {
            continue;
        }

        if (existedBefore) {
            filesUpdated++;
        } else {
            filesCreated++;
        }
    }

    return {
        group: "journeys",
        name: "repairJourneyExports",
        status:
            filesCreated > 0
                ? "created"
                : filesUpdated > 0
                  ? "updated"
                  : "unchanged",
        created: filesCreated > 0 ? 1 : 0,
        updated: filesUpdated > 0 ? 1 : 0,
        removed: 0,
        unchanged: filesCreated === 0 && filesUpdated === 0 ? 1 : 0,
        warning: 0,
        failed: 0,
        filesCreated,
        filesUpdated,
        filesRemoved: 0,
        details: [],
    };
}
