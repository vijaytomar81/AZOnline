// src/tools/page-elements-validator/commands/repair.ts

import { createLogger } from "../../../utils/logger";
import { normalizeArgv, hasFlag, getArg } from "../../../utils/argv";
import {
    PAGE_ELEMENTS_GENERATOR_STATE_DIR,
    PAGE_ELEMENTS_GENERATOR_STATE_FILE,
    PAGE_SCANNER_MAPS_DIR,
    PAGES_DIR,
} from "../../../utils/paths";
import {
    printSection,
    printKeyValue,
    printStatus,
    printIndented,
    printSummary,
    success,
    strong,
} from "../../../utils/cliFormat";

import { runElementsGenerator } from "../../page-elements-generator/generator/runner";

export async function runRepairCommand(args: string[]) {
    const argv = normalizeArgv(args);

    const verbose = hasFlag(argv, "--verbose");
    const log = createLogger({
        prefix: "[validator - repair]",
        logLevel: verbose ? "debug" : "info",
        withTimestamp: true,
    });

    log.info("Command: repair");

    const mapsDir =
        getArg(argv, "--mapsDir") ?? PAGE_SCANNER_MAPS_DIR;

    const pagesDir =
        getArg(argv, "--pagesDir") ?? PAGES_DIR;

    const stateDir =
        getArg(argv, "--stateDir") ?? PAGE_ELEMENTS_GENERATOR_STATE_DIR;

    const stateFile =
        getArg(argv, "--stateFile") ?? PAGE_ELEMENTS_GENERATOR_STATE_FILE;

    const merge = hasFlag(argv, "--merge");
    const changedOnly = hasFlag(argv, "--changedOnly");
    const stateOnly = hasFlag(argv, "--stateOnly");
    const scaffold = !hasFlag(argv, "--noScaffold");

    printSection("Environment");
    printKeyValue("mapsDir", mapsDir);
    printKeyValue("pagesDir", pagesDir);
    printKeyValue("stateDir", stateDir);
    printKeyValue("stateFile", stateFile);

    printSection("Flags");
    printKeyValue("merge", merge);
    printKeyValue("changedOnly", changedOnly);
    printKeyValue("stateOnly", stateOnly);
    printKeyValue("scaffold", scaffold);

    printSection("Scanning page-maps");

    const report = await runElementsGenerator({
        mapsDir,
        pagesDir,
        stateDir,
        stateFile,
        merge,
        changedOnly,
        stateOnly,
        scaffold,
        verbose,
        log,
    });

    log.info(`Found ${report.pagesScanned} page-map(s)`);

    printSection("Processing pages");

    for (const page of report.pageReports) {
        const symbol = page.changed ? "➕" : "✓";
        printStatus(symbol, page.pageKey);

        printIndented("elements.ts", page.elementsStatus);
        printIndented("aliases.generated.ts", page.aliasesGeneratedStatus);
        printIndented("page object", page.pageObjectStatus);

        if (page.registryStatus === "already-registered") {
            printIndented("registry", "already registered");
        } else if (page.registryStatus === "added-to-index") {
            printIndented("registry", "added to index.ts");
        } else if (page.registryStatus === "added-to-page-manager") {
            printIndented("registry", "added to PageManager");
        } else if (page.registryStatus === "added-to-both") {
            printIndented("registry", "added to index.ts");
            printIndented("registry", "added to PageManager");
        }

        log.info("");
    }

    printSummary(
        "REPAIR SUMMARY",
        [
            ["Pages scanned", report.pagesScanned],
            ["Pages changed", report.pagesChanged],
            ["Files generated", report.filesGenerated],
            ["Registry updates", report.registryUpdates],
            ["State updated", report.stateUpdated ? "yes" : "no"],
        ],
        success("COMPLETED")
    );
}