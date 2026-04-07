// src/tools/pageObjects/repair/commands/repair.ts

import fs from "node:fs";

import { createLogger } from "@utils/logger";
import { normalizeArgv, hasFlag, getArg } from "@utils/argv";
import {
    PAGE_MAPS_DIR,
    PAGE_OBJECTS_DIR,
    PAGE_REGISTRY_DIR,
    PAGE_MANIFEST_DIR,
} from "@utils/paths";
import { printKeyValue, printSection } from "@utils/cliFormat";

import { runRepairPipeline } from "../repair/pipeline/runner";
import { printRepairExecution, printRepairSummary } from "../repair/report";

export async function runRepairCommand(args: string[]) {
    const argv = normalizeArgv(args);
    const verbose = hasFlag(argv, "--verbose");

    const log = createLogger({
        prefix: "[page-object-repair][repair]",
        logLevel: verbose ? "debug" : "info",
        withTimestamp: true,
    });

    const mapsDir = getArg(argv, "--mapsDir") ?? PAGE_MAPS_DIR;
    const pageObjectsDir = getArg(argv, "--pageObjectsDir") ?? PAGE_OBJECTS_DIR;
    const pageRegistryDir = getArg(argv, "--pageRegistryDir") ?? PAGE_REGISTRY_DIR;
    const manifestFile = getArg(argv, "--manifestFile") ?? PAGE_MANIFEST_DIR;

    printSection("Environment");
    printKeyValue("mapsDir", mapsDir);
    printKeyValue("pageObjectsDir", pageObjectsDir);
    printKeyValue("pageRegistryDir", pageRegistryDir);
    printKeyValue("manifestFile", manifestFile);
    printKeyValue("verbose", verbose);

    if (!fs.existsSync(mapsDir)) {
        log.error(`mapsDir not found: ${mapsDir}`);
        process.exit(1);
    }

    if (!fs.existsSync(pageObjectsDir)) {
        log.error(`pageObjectsDir not found: ${pageObjectsDir}`);
        process.exit(1);
    }

    if (!fs.existsSync(pageRegistryDir)) {
        log.error(`pageRegistryDir not found: ${pageRegistryDir}`);
        process.exit(1);
    }

    const result = await runRepairPipeline({
        mapsDir,
        pageObjectsDir,
        pageRegistryDir,
        manifestFile,
        verbose,
        log,
    });

    printRepairExecution(result, verbose);
    printRepairSummary(result);
}