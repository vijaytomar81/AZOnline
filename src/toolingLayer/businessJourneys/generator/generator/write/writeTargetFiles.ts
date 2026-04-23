// src/toolingLayer/businessJourneys/generator/generator/write/writeTargetFiles.ts

import path from "node:path";
import { BUSINESS_JOURNEYS_DIR } from "@utils/paths";
import type {
    JourneyGenerationInputs,
    JourneyTarget,
    WriteTargetFilesResult,
} from "../types";
import { selectCandidates } from "../selectCandidates";
import { renderIndexFile } from "../render/renderIndexFile";
import { renderRunJourneyFile } from "../render/renderRunJourneyFile";
import { writeFileAlways } from "./writeFileAlways";
import { writeFileIfMissing } from "./writeFileIfMissing";

function buildTargetSegments(target: JourneyTarget): string[] {
    const segments = [
        String(target.entryPlatform),
        String(target.entryApplication),
    ];

    if (
        String(target.entryApplication) !==
        String(target.destinationApplication)
    ) {
        segments.push(String(target.destinationApplication));
    }

    segments.push(String(target.product));
    segments.push(String(target.journeyType));

    return segments;
}

export function writeTargetFiles(
    target: JourneyTarget,
    inputs: JourneyGenerationInputs
): WriteTargetFilesResult {
    try {
        const candidates = selectCandidates(target, inputs);
        const baseDir = path.join(
            BUSINESS_JOURNEYS_DIR,
            ...buildTargetSegments(target)
        );
        const journeyName = String(target.journeyType);
        const runFile = path.join(baseDir, `run${journeyName}Journey.ts`);
        const indexFile = path.join(baseDir, "index.ts");

        let filesCreated = 0;
        let indexChanged = false;

        if (
            writeFileIfMissing(
                runFile,
                renderRunJourneyFile({
                    filePath: runFile,
                    target,
                    entries: candidates,
                })
            )
        ) {
            filesCreated++;
        }

        if (
            writeFileAlways(
                indexFile,
                renderIndexFile({
                    filePath: indexFile,
                    exports: [
                        {
                            exportName: `run${journeyName}Journey`,
                            from: `run${journeyName}Journey`,
                        },
                    ],
                })
            )
        ) {
            filesCreated++;
            indexChanged = true;
        }

        if (filesCreated > 0 && !indexChanged) {
            return {
                status: "created",
                filesCreated,
            };
        }

        if (filesCreated > 0) {
            return {
                status: "updated",
                filesCreated,
            };
        }

        return {
            status: "unchanged",
            filesCreated: 0,
        };
    } catch {
        return {
            status: "failed",
            filesCreated: 0,
        };
    }
}
