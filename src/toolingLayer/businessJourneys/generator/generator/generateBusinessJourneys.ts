// src/toolingLayer/businessJourneys/generator/generator/generateBusinessJourneys.ts

import {
    info,
    printCommandTitle,
    printEnvironment,
    printSection,
    printStatus,
    printSummary,
    success,
} from "@utils/cliFormat";
import { ICONS } from "@utils/icons";
import {
    BUSINESS_JOURNEYS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
    toRepoRelative,
} from "@utils/paths";
import { buildJourneyTargets } from "./buildJourneyTargets";
import { loadJourneyGenerationInputs } from "./loadJourneyGenerationInputs";
import type { GenerateOptions, GenerateSummary, JourneyTarget } from "./types";
import { ensureFrameworkFiles } from "./write/ensureFrameworkFiles";
import { writeTargetFiles } from "./write/writeTargetFiles";

function buildTargetKey(target: JourneyTarget): string {
    const route =
        String(target.entryApplication) ===
        String(target.destinationApplication)
            ? `${target.entryPlatform}.${target.entryApplication}`
            : `${target.entryPlatform}.${target.entryApplication}.${target.destinationApplication}`;

    return `${route}.${target.product}.${target.journeyType}`;
}

function printTargetDetails(args: {
    target: JourneyTarget;
    createdFiles: number;
    verbose: boolean;
}): void {
    const key = buildTargetKey(args.target);

    if (args.createdFiles > 0) {
        printStatus(ICONS.successIcon, key);
    } else {
        printStatus(ICONS.hintIcon, `${key} -> skipped (already exists)`);
    }

    if (!args.verbose) {
        return;
    }

    console.log(`   → entry platform        : ${args.target.entryPlatform}`);
    console.log(`   → entry application     : ${args.target.entryApplication}`);
    console.log(
        `   → destination platform  : ${args.target.destinationPlatform}`
    );
    console.log(
        `   → destination app       : ${args.target.destinationApplication}`
    );
    console.log(`   → product               : ${args.target.product}`);
    console.log(`   → journey               : ${args.target.journeyType}`);
    console.log(`   → files created         : ${args.createdFiles}`);
    console.log("");
}

function buildSummary(args: {
    targets: JourneyTarget[];
    frameworkFiles: number;
    createdByTarget: number;
}): GenerateSummary {
    return {
        targets: args.targets.length,
        filesCreated: args.frameworkFiles + args.createdByTarget,
    };
}

export function generateBusinessJourneys(options: GenerateOptions): void {
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

    for (const target of targets) {
        const result = writeTargetFiles(target, inputs);
        createdByTarget += result.filesCreated;

        printTargetDetails({
            target,
            createdFiles: result.filesCreated,
            verbose: options.verbose,
        });
    }

    const summary = buildSummary({
        targets,
        frameworkFiles,
        createdByTarget,
    });

    printSummary(
        "GENERATOR SUMMARY",
        [
            ["Targets", summary.targets],
            ["Files created", summary.filesCreated],
        ],
        summary.filesCreated > 0 ? success("UPDATED") : info("UP TO DATE")
    );
}
