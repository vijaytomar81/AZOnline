// src/toolingLayer/businessJourneys/generator/generator/write/ensureFrameworkFiles.ts

import path from "node:path";
import { BUSINESS_JOURNEYS_DIR } from "@utils/paths";
import { renderFrameworkFile } from "../render/renderFrameworkFile";
import { writeFileAlways } from "./writeFileAlways";

export function ensureFrameworkFiles(): number {
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

    let changed = 0;

    for (const file of files) {
        if (
            writeFileAlways(
                file.filePath,
                renderFrameworkFile({
                    filePath: file.filePath,
                    kind: file.kind,
                })
            )
        ) {
            changed++;
        }
    }

    return changed;
}
