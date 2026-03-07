// src/tools/page-elements-validator/commands/validate.ts

import fs from "node:fs";
import path from "node:path";

import { createLogger } from "../../../utils/logger";
import { normalizeArgv, hasFlag, getArg } from "../../../utils/argv";
import { safeReadJson, listFiles } from "../../../utils/fs";
import { PAGE_SCANNER_MAPS_DIR, PAGES_DIR } from "../../../utils/paths";
import {
    printSection,
    printKeyValue,
    printStatus,
    printSummary,
    success,
    warning,
    failure,
    strong,
} from "../../../utils/cliFormat";

import { validateOnePage } from "../validators/pageOutputs";
import { checkPagesModuleHygiene } from "../validators/moduleHygiene";
import { checkPageRegistry } from "../validators/pageRegistry";

type PageMapLite = { pageKey: string };

function listPageMapFiles(mapsDir: string): string[] {
    return listFiles(mapsDir, { ext: ".json" }).filter((f) => !f.startsWith("."));
}

export async function runValidateCommand(args: string[]) {
    const argv = normalizeArgv(args);

    const verbose = hasFlag(argv, "--verbose");
    const strict = hasFlag(argv, "--strict");
    const checkModuleHygiene =
        !hasFlag(argv, "--noModuleHygiene") &&
        !hasFlag(argv, "--noIndexHygiene");

    const log = createLogger({
        prefix: "[validator - validate]",
        verbose,
        withTimestamp: true,
    });

    log.info("Command: validate");

    const mapsDir =
        getArg(argv, "--mapsDir") ?? PAGE_SCANNER_MAPS_DIR;

    const pagesDir =
        getArg(argv, "--pagesDir") ?? PAGES_DIR;

    printSection("Environment");
    printKeyValue("mapsDir", mapsDir);
    printKeyValue("pagesDir", pagesDir);
    printKeyValue("strict", strict);
    printKeyValue("moduleHygiene", checkModuleHygiene);

    if (!fs.existsSync(mapsDir)) {
        log.error(`mapsDir not found: ${mapsDir}`);
        process.exit(1);
    }

    if (!fs.existsSync(pagesDir)) {
        log.error(`pagesDir not found: ${pagesDir}`);
        process.exit(1);
    }

    const mapFiles = listPageMapFiles(mapsDir);

    printSection("Scanning page-maps");
    console.log(`Found ${mapFiles.length} page-map(s)`);

    let ok = 0;
    let bad = 0;
    let warnOnly = 0;
    let warnCount = 0;

    printSection("Validating pages");

    for (const mf of mapFiles) {
        const res = validateOnePage({ mapsDir, pagesDir, mapFile: mf });

        const pageKey =
            safeReadJson<PageMapLite>(path.join(mapsDir, mf))?.pageKey ??
            mf.replace(/\.json$/, "");

        const registryRes = checkPageRegistry({
            pageKey,
            pagesDir,
        });

        const pageWarnings = [...res.warnings, ...registryRes.warnings];
        const pageErrors = [...res.errors, ...registryRes.errors];

        warnCount += pageWarnings.length;

        if (pageErrors.length > 0) {
            bad++;
            printStatus("❌", pageKey);

            for (const e of pageErrors) {
                console.log(`  ${e}`);
            }

            for (const w of pageWarnings) {
                if (verbose) log.debug(`WARN: ${pageKey}: ${w}`);
                else console.log(`  ${warning("⚠️")} ${w}`);
            }

            console.log("");
            continue;
        }

        if (pageWarnings.length > 0) {
            warnOnly++;
            printStatus("⚠️", pageKey);

            for (const w of pageWarnings) {
                if (verbose) log.debug(`WARN: ${pageKey}: ${w}`);
                else console.log(`  ${warning("⚠️")} ${w}`);
            }

            console.log("");
            continue;
        }

        ok++;
        printStatus("✓", pageKey);
    }

    if (checkModuleHygiene) {
        printSection("Module hygiene");

        const pagesH = checkPagesModuleHygiene(pagesDir);
        warnCount += pagesH.warnings.length;

        if (pagesH.errors.length === 0 && pagesH.warnings.length === 0) {
            printStatus("✓", "src/pages/index.ts / pageManager.ts");
        } else {
            for (const w of pagesH.warnings) {
                console.log(`  ${warning("⚠️")} ${w}`);
            }

            for (const e of pagesH.errors) {
                bad++;
                printStatus("❌", e);
            }
        }
    }

    printSummary("VALIDATE SUMMARY", [
        ["Pages checked", mapFiles.length],
        ["OK", ok],
        ["Warnings", warnOnly],
        ["Failed", bad],
        ["Total warns", warnCount],
    ]);

    const resultText =
        bad > 0 ? failure("FAILED") : strict && warnCount > 0 ? failure("FAILED") : success("PASSED");

    console.log(`${strong("Result".padEnd(20, " "))}: ${resultText}`);

    if (bad > 0) process.exit(1);

    if (strict && warnCount > 0) {
        log.error(`Strict mode: warnings found (${warnCount}).`);
        process.exit(1);
    }
}