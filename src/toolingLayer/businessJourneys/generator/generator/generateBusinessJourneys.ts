// src/toolingLayer/businessJourneys/generator/generator/generateBusinessJourneys.ts

import {
    info,
    printCommandTitle,
    printEnvironment,
    printSection,
    printSummary,
    success,
    failure,
    warning,
} from "@utils/cliFormat";
import {
    BUSINESS_JOURNEYS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
    toRepoRelative,
} from "@utils/paths";
import {
    renderJourneyTree,
    type JourneyTreeLeaf,
} from "@toolingLayer/businessJourneys/common";
import { buildJourneyTargets } from "./buildJourneyTargets";
import { loadJourneyGenerationInputs } from "./loadJourneyGenerationInputs";
import type {
    GenerateOptions,
    GenerateSummary,
    JourneyTarget,
} from "./types";
import { ensureFrameworkFiles } from "./write/ensureFrameworkFiles";
import { writeTargetFiles } from "./write/writeTargetFiles";

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

function buildLeafSummary(args: {
    status: "created" | "updated" | "unchanged" | "failed";
    filesCreated: number;
}): string {
    if (args.status === "failed") {
        return "failed";
    }

    if (args.status === "unchanged") {
        return "unchanged";
    }

    if (args.status === "created") {
        return `${args.filesCreated} file(s) created`;
    }

    return `${args.filesCreated} file(s) updated`;
}

function buildSummary(args: {
    targets: JourneyTarget[];
    frameworkFiles: number;
    created: number;
    updated: number;
    unchanged: number;
    failed: number;
    createdByTarget: number;
}): GenerateSummary {
    return {
        targets: args.targets.length,
        created: args.created,
        updated: args.updated + (args.frameworkFiles > 0 ? 1 : 0),
        unchanged: args.unchanged,
        failed: args.failed,
        filesCreated: args.frameworkFiles + args.createdByTarget,
    };
}

export function generateBusinessJourneys(
    options: GenerateOptions
): void {
    printCommandTitle("BUSINESS JOURNEY GENERATOR", "toolsBuildIcon");

    printEnvironment([
        ["pageActionsManifest", toRepoRelative(PAGE_ACTIONS_MANIFEST_DIR)],
        ["businessJourneysDir", toRepoRelative(BUSINESS_JOURNEYS_DIR)],
        ["verbose", options.verbose],
    ]);

    const inputs = loadJourneyGenerationInputs();
    const targets = buildJourneyTargets(inputs);

    printSection("Generation details");

    const frameworkFiles = ensureFrameworkFiles();
    let createdByTarget = 0;
    let created = 0;
    let updated = 0;
    let unchanged = 0;
    let failed = 0;

    const leaves: JourneyTreeLeaf[] = [];

    for (const target of targets) {
        const result = writeTargetFiles(target, inputs);
        createdByTarget += result.filesCreated;

        if (result.status === "created") {
            created++;
        } else if (result.status === "updated") {
            updated++;
        } else if (result.status === "unchanged") {
            unchanged++;
        } else {
            failed++;
        }

        leaves.push({
            segments: buildTargetSegments(target),
            status: result.status,
            summary: buildLeafSummary({
                status: result.status,
                filesCreated: result.filesCreated,
            }),
        });
    }

    renderJourneyTree(leaves);

    const summary = buildSummary({
        targets,
        frameworkFiles,
        created,
        updated,
        unchanged,
        failed,
        createdByTarget,
    });

    const resultText =
        summary.failed > 0
            ? failure("COMPLETED WITH ERRORS")
            : summary.created > 0 || summary.updated > 0
              ? success("UPDATED")
              : info("UP TO DATE");

    printSummary(
        "GENERATOR SUMMARY",
        [
            ["Targets", summary.targets],
            ["Created", summary.created],
            ["Updated", summary.updated],
            ["Unchanged", summary.unchanged],
            ["Failed", summary.failed],
            ["Files created", summary.filesCreated],
        ],
        resultText
    );
}
