// src/toolingLayer/businessJourneys/generator/generator/write/ensureFrameworkFiles.ts

import path from "node:path";
import { fileExists } from "@utils/fs";
import { BUSINESS_JOURNEYS_DIR } from "@utils/paths";
import type { EnsureFrameworkFilesResult } from "../types";
import { renderFrameworkFile } from "../render/renderFrameworkFile";
import { writeFileAlways } from "./writeFileAlways";

export function ensureFrameworkFiles(): EnsureFrameworkFilesResult {
    const frameworkDir = path.join(BUSINESS_JOURNEYS_DIR, "framework");

    const files: Array<{
        filePath: string;
        kind: "types" | "runJourney" | "index" | "rootIndex";
    }> = [
        {
            filePath: path.join(frameworkDir, "types.ts"),
            kind: "types",
        },
        {
            filePath: path.join(frameworkDir, "runJourney.ts"),
            kind: "runJourney",
        },
        {
            filePath: path.join(frameworkDir, "index.ts"),
            kind: "index",
        },
        {
            filePath: path.join(BUSINESS_JOURNEYS_DIR, "index.ts"),
            kind: "rootIndex",
        },
    ];

    let filesCreated = 0;
    let filesUpdated = 0;
    let filesSkipped = 0;

    for (const file of files) {
        const existedBefore = fileExists(file.filePath);
        const changed = writeFileAlways(
            file.filePath,
            renderFrameworkFile({
                filePath: file.filePath,
                kind: file.kind,
            })
        );

        if (!changed) {
            filesSkipped++;
            continue;
        }

        if (existedBefore) {
            filesUpdated++;
        } else {
            filesCreated++;
        }
    }

    return {
        filesCreated,
        filesUpdated,
        filesSkipped,
    };
}
