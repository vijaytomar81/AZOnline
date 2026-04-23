// src/toolingLayer/pageActions/generator/cli/runPageActionGenerator.ts

import {
    failure,
    info,
    printCommandTitle,
    printEnvironment,
    printSummary,
    success,
} from "@utils/cliFormat";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_ACTIONS_REGISTRY_DIR,
    PAGE_MANIFEST_DIR,
    toRepoRelative,
} from "@utils/paths";
import { generatePageActionsFromManifest } from "../core/generatePageActionsFromManifest";

export function runPageActionGenerator(args: {
    verbose?: boolean;
} = {}): number {
    const verbose = !!args.verbose;

    printCommandTitle("PAGE ACTION GENERATOR", "toolsBuildIcon");

    printEnvironment([
        ["pageObjectsManifest", toRepoRelative(PAGE_MANIFEST_DIR)],
        ["pageActionsDir", toRepoRelative(PAGE_ACTIONS_ACTIONS_DIR)],
        ["manifestDir", toRepoRelative(PAGE_ACTIONS_MANIFEST_DIR)],
        ["registryDir", toRepoRelative(PAGE_ACTIONS_REGISTRY_DIR)],
        ["verbose", verbose],
    ]);

    const summary = generatePageActionsFromManifest({
        verbose,
    });

    const resultText =
        summary.failed > 0
            ? failure("COMPLETED WITH ERRORS")
            : summary.created > 0 ||
                summary.updated > 0 ||
                summary.metadataExportFilesCreated > 0 ||
                summary.metadataExportFilesUpdated > 0 ||
                summary.registryFilesCreated > 0 ||
                summary.registryFilesUpdated > 0
              ? success("UPDATED")
              : info("UP TO DATE");

    printSummary(
        "GENERATOR SUMMARY",
        [
            ["Available pages", summary.availablePages],
            ["Existing actions", summary.existingActions],
            ["Created", summary.created],
            ["Updated", summary.updated],
            ["Unchanged", summary.unchanged],
            ["Failed", summary.failed],
            [
                "Metadata export files created",
                summary.metadataExportFilesCreated,
            ],
            [
                "Metadata export files updated",
                summary.metadataExportFilesUpdated,
            ],
            ["Registry files created", summary.registryFilesCreated],
            ["Registry files updated", summary.registryFilesUpdated],
            ["Invalid pages", summary.invalidPages],
            ["Exit code", summary.exitCode],
        ],
        resultText
    );

    return summary.exitCode;
}
