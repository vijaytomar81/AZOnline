// src/businessJourneyTools/business-journey-generator/generator/generateBusinessJourneys.ts

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
import { BUSINESS_JOURNEYS_DIR, PAGE_ACTIONS_MANIFEST_DIR } from "@utils/paths";
import { buildJourneyTargets } from "./buildJourneyTargets";
import { loadJourneyGenerationInputs } from "./loadJourneyGenerationInputs";
import type { GenerateOptions, GenerateSummary, JourneyTarget } from "./types";
import { ensureFrameworkFiles } from "./write/ensureFrameworkFiles";
import { writeTargetFiles } from "./write/writeTargetFiles";

function buildTargetKey(target: JourneyTarget): string {
    return `${target.application}.${target.product}.${target.journey}.${target.entryPoint}`;
}

function printTargetDetails(args: {
    target: JourneyTarget;
    createdFiles: number;
    verbose: boolean;
}) {
    const key = buildTargetKey(args.target);

    if (args.createdFiles > 0) {
        printStatus(ICONS.successIcon, key);
    } else {
        printStatus(ICONS.hintIcon, `${key} -> skipped (already exists)`);
    }

    if (!args.verbose) {
        return;
    }

    console.log(`   → application   : ${args.target.application}`);
    console.log(`   → product       : ${args.target.product}`);
    console.log(`   → journey       : ${args.target.journey}`);
    console.log(`   → entry point   : ${args.target.entryPoint}`);
    console.log(`   → files created : ${args.createdFiles}`);
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

export function generateBusinessJourneys(options: GenerateOptions) {
    printCommandTitle("BUSINESS JOURNEY GENERATOR", "toolsBuildIcon");

    printEnvironment([
        ["pageActionsManifest", PAGE_ACTIONS_MANIFEST_DIR],
        ["businessJourneysDir", BUSINESS_JOURNEYS_DIR],
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
