// src/toolingLayer/businessJourneys/generator/generator/generateBusinessJourneys.ts

import {
    info,
    printCommandTitle,
    printEnvironment,
    printSection,
    printSummary,
    success,
    failure,
} from "@utils/cliFormat";
import {
    BUSINESS_JOURNEYS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_ACTIONS_REGISTRY_DIR,
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
import {
    buildJourneyFolderSegments,
} from "./journey/journeyNaming";
import { ensureFrameworkFiles } from "./write/ensureFrameworkFiles";
import { writeTargetFiles } from "./write/writeTargetFiles";

function buildTargetSegments(
    target: JourneyTarget
): string[] {
    return [
        String(target.platform),
        String(target.application),
        String(target.product),
        ...buildJourneyFolderSegments(
            target.journeyContext
        ),
    ];
}

function buildSummary(args: {
    availablePageActions: number;
    created: number;
    updated: number;
    unchanged: number;
    failed: number;
    filesCreated: number;
    filesUpdated: number;
    filesSkipped: number;
}): GenerateSummary {
    return {
        availablePageActions:
            args.availablePageActions,
        created: args.created,
        updated: args.updated,
        unchanged: args.unchanged,
        failed: args.failed,
        filesCreated: args.filesCreated,
        filesUpdated: args.filesUpdated,
        filesSkipped: args.filesSkipped,
        exitCode:
            args.failed > 0 ? 1 : 0,
    };
}

export function generateBusinessJourneys(
    options: GenerateOptions
): void {
    printCommandTitle(
        "BUSINESS JOURNEY GENERATOR",
        "toolsBuildIcon"
    );

    printEnvironment([
        [
            "pageActionsManifest",
            toRepoRelative(
                PAGE_ACTIONS_MANIFEST_DIR
            ),
        ],
        [
            "pageActionsRegistry",
            toRepoRelative(
                PAGE_ACTIONS_REGISTRY_DIR
            ),
        ],
        [
            "businessJourneysDir",
            toRepoRelative(
                BUSINESS_JOURNEYS_DIR
            ),
        ],
        ["verbose", options.verbose],
    ]);

    const inputs =
        loadJourneyGenerationInputs();

    const targets =
        buildJourneyTargets(inputs);

    printSection("Generation details");

    const frameworkResult =
        ensureFrameworkFiles();

    let created = 0;
    let updated = 0;
    let unchanged = 0;
    let failed = 0;

    let filesCreated =
        frameworkResult.filesCreated;

    let filesUpdated =
        frameworkResult.filesUpdated;

    let filesSkipped =
        frameworkResult.filesSkipped;

    const leaves: JourneyTreeLeaf[] = [];

    for (const change of frameworkResult.changes) {
        if (change.status === "created") {
            leaves.push({
                segments: [
                    "framework",
                    change.fileName,
                ],
                status: "created",
                summary: "created",
            });
        }
    }

    for (const target of targets) {
        const result =
            writeTargetFiles(
                target,
                inputs
            );

        filesCreated +=
            result.filesCreated;

        filesUpdated +=
            result.filesUpdated;

        filesSkipped +=
            result.filesSkipped;

        if (
            result.status === "created"
        ) {
            created++;

            leaves.push({
                segments:
                    buildTargetSegments(
                        target
                    ),
                status: "created",
                summary: `${result.filesCreated} file(s) created`,
            });

            continue;
        }

        if (
            result.status === "updated"
        ) {
            updated++;
            continue;
        }

        if (
            result.status === "failed"
        ) {
            failed++;
            continue;
        }

        unchanged++;
    }

    if (leaves.length > 0) {
        renderJourneyTree(leaves);
    } else {
        console.log(
            info(
                "ℹ no new business journeys were created"
            )
        );
    }

    const summary =
        buildSummary({
            availablePageActions:
                inputs.pageActions.length,
            created,
            updated,
            unchanged,
            failed,
            filesCreated,
            filesUpdated,
            filesSkipped,
        });

    const resultText =
        summary.failed > 0
            ? failure(
                  "INCOMPLETE"
              )
            : success(
                  "ALL GOOD"
              );

    printSummary(
        "GENERATOR SUMMARY",
        [
            [
                "Available Page Actions",
                summary.availablePageActions,
            ],
            ["Created", summary.created],
            ["Updated", summary.updated],
            [
                "Unchanged",
                summary.unchanged,
            ],
            ["Failed", summary.failed],
            [
                "Files created",
                summary.filesCreated,
            ],
            [
                "Files updated",
                summary.filesUpdated,
            ],
            [
                "Files skipped",
                summary.filesSkipped,
            ],
            [
                "Exit code",
                summary.exitCode,
            ],
        ],
        resultText
    );
}
