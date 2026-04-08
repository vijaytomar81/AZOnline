// src/toolingLayer/businessJourneys/generator/generator/write/ensureFrameworkFiles.ts

import path from "node:path";
import { BUSINESS_JOURNEYS_DIR } from "@utils/paths";
import { renderFrameworkFile } from "../render/renderFrameworkFile";
import { writeFileIfMissing } from "./writeFileIfMissing";

export function ensureFrameworkFiles(): number {
    const files: Array<{
        filePath: string;
        kind:
            | "shared-types"
            | "shared-logging"
            | "shared-index"
            | "runner-runJourneySteps"
            | "runner-runBusinessJourney"
            | "runner-index"
            | "registry-journeyRegistry"
            | "registry-index"
            | "root-index";
    }> = [
        {
            filePath: path.join(BUSINESS_JOURNEYS_DIR, "shared", "types.ts"),
            kind: "shared-types",
        },
        {
            filePath: path.join(BUSINESS_JOURNEYS_DIR, "shared", "logging.ts"),
            kind: "shared-logging",
        },
        {
            filePath: path.join(BUSINESS_JOURNEYS_DIR, "shared", "index.ts"),
            kind: "shared-index",
        },
        {
            filePath: path.join(BUSINESS_JOURNEYS_DIR, "runner", "runJourneySteps.ts"),
            kind: "runner-runJourneySteps",
        },
        {
            filePath: path.join(BUSINESS_JOURNEYS_DIR, "runner", "runBusinessJourney.ts"),
            kind: "runner-runBusinessJourney",
        },
        {
            filePath: path.join(BUSINESS_JOURNEYS_DIR, "runner", "index.ts"),
            kind: "runner-index",
        },
        {
            filePath: path.join(BUSINESS_JOURNEYS_DIR, "registry", "journeyRegistry.ts"),
            kind: "registry-journeyRegistry",
        },
        {
            filePath: path.join(BUSINESS_JOURNEYS_DIR, "registry", "index.ts"),
            kind: "registry-index",
        },
        {
            filePath: path.join(BUSINESS_JOURNEYS_DIR, "index.ts"),
            kind: "root-index",
        },
    ];

    let created = 0;

    for (const item of files) {
        const content = renderFrameworkFile({
            filePath: item.filePath,
            kind: item.kind,
        });

        if (writeFileIfMissing(item.filePath, content)) {
            created++;
        }
    }

    return created;
}
