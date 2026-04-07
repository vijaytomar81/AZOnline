// src/tools/pageActions/generator/cli/runPageActionGenerator.ts

import path from "node:path";
import { generatePageActionsFromManifest } from "../core/generatePageActionsFromManifest";
import {
    printCommandTitle,
    printEnvironment,
    printSummary,
    success,
    warning,
} from "@utils/cliFormat";
import { ICONS } from "@utils/icons";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_MANIFEST_DIR,
} from "@utils/paths";

type CliOptions = {
    verbose: boolean;
};

function parseArgs(): CliOptions {
    const args = process.argv.slice(2);

    return {
        verbose: args.includes("--verbose"),
    };
}

function main(): void {
    const options = parseArgs();

    printCommandTitle("PAGE ACTION GENERATOR", "elementsGeneratorIcon");

    printEnvironment([
        ["pageObjectsManifest", path.resolve(PAGE_MANIFEST_DIR)],
        ["pageActionsDir", path.resolve(PAGE_ACTIONS_ACTIONS_DIR)],
        ["manifestDir", path.resolve(PAGE_ACTIONS_MANIFEST_DIR)],
        ["verbose", options.verbose],
    ]);

    const summary = generatePageActionsFromManifest({
        verbose: options.verbose,
    });

    const resultText =
        summary.generatedActions > 0
            ? success("UPDATED")
            : warning("UP TO DATE");

    printSummary(
        "GENERATION SUMMARY",
        [
            ["Page objects", summary.totalPages],
            ["Existing actions", summary.existingActions],
            ["New actions", summary.generatedActions],
            ["Skipped actions", summary.skippedActions],
        ],
        resultText
    );
}

main();
