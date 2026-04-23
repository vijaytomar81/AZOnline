// src/toolingLayer/pageActions/generator/cli/runPageActionGenerator.ts

import path from "node:path";
import { generatePageActionsFromManifest } from "../core/generatePageActionsFromManifest";
import {
    printCommandTitle,
    printEnvironment,
    printSummary,
    success,
    warning,
    failure,
} from "@utils/cliFormat";
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
        summary.exitCode > 0
            ? failure("ERROR FOUND")
            : summary.created > 0 || summary.updated > 0
              ? success("UPDATED")
              : warning("UP TO DATE");

    printSummary(
        "GENERATION SUMMARY",
        [
            ["Available page objects", summary.availablePages],
            ["Created", summary.created],
            ["Updated", summary.updated],
            ["Unchanged", summary.unchanged],
            ["Failed", summary.failed],
            ["Registry files created", summary.registryFilesCreated],
            ["Registry files updated", summary.registryFilesUpdated],
            ["Invalid pages", summary.invalidPages],
            ["Exit code", summary.exitCode],
        ],
        resultText
    );

    if (summary.exitCode > 0) {
        process.exit(summary.exitCode);
    }
}

main();
