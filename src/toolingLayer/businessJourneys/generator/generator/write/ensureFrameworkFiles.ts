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
        fileName: string;
        kind: "types" | "runJourney" | "index" | "rootIndex";
    }> = [
        {
            filePath: path.join(frameworkDir, "types.ts"),
            fileName: "framework/types.ts",
            kind: "types",
        },
        {
            filePath: path.join(frameworkDir, "runJourney.ts"),
            fileName: "framework/runJourney.ts",
            kind: "runJourney",
        },
        {
            filePath: path.join(frameworkDir, "index.ts"),
            fileName: "framework/index.ts",
            kind: "index",
        },
        {
            filePath: path.join(BUSINESS_JOURNEYS_DIR, "index.ts"),
            fileName: "index.ts",
            kind: "rootIndex",
        },
    ];

    let filesCreated = 0;
    let filesUpdated = 0;
    let filesSkipped = 0;
    const changes: EnsureFrameworkFilesResult["changes"] = [];

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
            changes.push({
                fileName: file.fileName,
                status: "unchanged",
            });
            continue;
        }

        if (existedBefore) {
            filesUpdated++;
            changes.push({
                fileName: file.fileName,
                status: "updated",
            });
        } else {
            filesCreated++;
            changes.push({
                fileName: file.fileName,
                status: "created",
            });
        }
    }

    return {
        filesCreated,
        filesUpdated,
        filesSkipped,
        changes,
    };
}
