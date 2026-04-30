// src/toolingLayer/businessJourneys/generator/generator/write/writeTargetFiles.ts

import path from "node:path";
import { fileExists } from "@utils/fs";
import { BUSINESS_JOURNEYS_DIR } from "@utils/paths";
import type {
    JourneyGenerationInputs,
    JourneyTarget,
    WriteTargetFilesResult,
} from "../types";
import { selectCandidates } from "../selectCandidates";
import { renderIndexFile } from "../render/renderIndexFile";
import { renderRunJourneyFile } from "../render/renderRunJourneyFile";
import {
    buildJourneyExportName,
    buildJourneyFolderSegments,
    buildJourneyRunnerFileName,
} from "../journey/journeyNaming";
import { writeFileAlways } from "./writeFileAlways";
import { writeFileIfMissing } from "./writeFileIfMissing";

function buildTargetSegments(target: JourneyTarget): string[] {
    return [
        String(target.platform),
        String(target.application),
        String(target.product),
        ...buildJourneyFolderSegments(
            target.journeyContext
        ),
    ];
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

        const runFile = path.join(
            baseDir,
            buildJourneyRunnerFileName(
                target.journeyContext
            )
        );

        const indexFile = path.join(
            baseDir,
            "index.ts"
        );

        const runExistedBefore = fileExists(runFile);
        const indexExistedBefore = fileExists(indexFile);

        let filesCreated = 0;
        let filesUpdated = 0;

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
                            exportName:
                                buildJourneyExportName(
                                    target.journeyContext
                                ),
                            from: buildJourneyRunnerFileName(
                                target.journeyContext
                            ).replace(".ts", ""),
                        },
                    ],
                })
            )
        ) {
            if (indexExistedBefore) {
                filesUpdated++;
            } else {
                filesCreated++;
            }
        }

        const filesSkipped =
            (runExistedBefore ? 1 : 0) +
            (indexExistedBefore &&
            filesUpdated === 0
                ? 1
                : 0);

        if (!runExistedBefore && filesCreated > 0) {
            return {
                status: "created",
                filesCreated,
                filesUpdated,
                filesSkipped,
            };
        }

        if (filesUpdated > 0) {
            return {
                status: "updated",
                filesCreated,
                filesUpdated,
                filesSkipped,
            };
        }

        return {
            status: "unchanged",
            filesCreated,
            filesUpdated,
            filesSkipped,
        };
    } catch {
        return {
            status: "failed",
            filesCreated: 0,
            filesUpdated: 0,
            filesSkipped: 0,
        };
    }
}
