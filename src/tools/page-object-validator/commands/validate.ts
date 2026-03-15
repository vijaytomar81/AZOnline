// src/tools/page-object-validator/commands/validate.ts

import fs from "node:fs";

import { createLogger } from "@/utils/logger";
import { normalizeArgv, hasFlag, getArg } from "@/utils/argv";
import {
    PAGE_MAPS_DIR,
    PAGE_OBJECTS_DIR,
    PAGE_REGISTRY_DIR,
    PAGE_OBJECTS_MANIFEST_FILE,
    PAGE_MAP_STATE_FILE,
} from "@/utils/paths";
import {
    printKeyValue,
    printSection,
} from "@/utils/cliFormat";

import { runValidationPipeline } from "../validate/pipeline/runner";
import {
    printValidationExecution,
    printValidationSummary,
} from "../validate/report";

export async function runValidateCommand(args: string[]) {
    const argv = normalizeArgv(args);

    const verbose = hasFlag(argv, "--verbose");
    const strict = hasFlag(argv, "--strict");

    const log = createLogger({
        prefix: "[page-object-validator][validate]",
        logLevel: verbose ? "debug" : "info",
        withTimestamp: true,
    });

    const mapsDir = getArg(argv, "--mapsDir") ?? PAGE_MAPS_DIR;
    const pageObjectsDir = getArg(argv, "--pageObjectsDir") ?? PAGE_OBJECTS_DIR;
    const pageRegistryDir = getArg(argv, "--pageRegistryDir") ?? PAGE_REGISTRY_DIR;
    const manifestFile = getArg(argv, "--manifestFile") ?? PAGE_OBJECTS_MANIFEST_FILE;
    const stateFile = getArg(argv, "--stateFile") ?? PAGE_MAP_STATE_FILE;

    printSection("Environment");
    printKeyValue("mapsDir", mapsDir);
    printKeyValue("pageObjectsDir", pageObjectsDir);
    printKeyValue("pageRegistryDir", pageRegistryDir);
    printKeyValue("manifestFile", manifestFile);
    printKeyValue("stateFile", stateFile);
    printKeyValue("strict", strict);
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

    const result = await runValidationPipeline({
        mapsDir,
        pageObjectsDir,
        pageRegistryDir,
        manifestFile,
        stateFile,
        verbose,
        strict,
        log,
    });

    printValidationExecution(result, verbose);
    printValidationSummary(result);

    if (result.summary.totalErrors > 0) {
        process.exit(1);
    }

    if (strict && result.summary.totalWarnings > 0) {
        process.exit(1);
    }
}