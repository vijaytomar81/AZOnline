// src/tools/page-elements-validator/commands/validate.ts

import fs from "node:fs";
import path from "node:path";

import { createLogger } from "@/utils/logger";
import { normalizeArgv, hasFlag, getArg } from "@/utils/argv";
import { safeReadJson, listFiles } from "@/utils/fs";
import { PAGE_MAPS_DIR, PAGES_DIR } from "@/utils/paths";
import { ICONS } from "@/utils/icons";
import { printTree } from "@/utils/cliTree";

import {
    printSection,
    printKeyValue,
    printStatus,
    printSummary,
    success,
    warning,
    failure,
    info,
    strong,
} from "@/utils/cliFormat";

import { validateOnePage } from "../validators/pageChain";
import { checkPagesModuleHygiene } from "../validators/moduleHygiene";
import { checkPageRegistry } from "../validators/pageRegistry";

type PageMapLite = { pageKey: string };

function listPageMapFiles(mapsDir: string): string[] {
    return listFiles(mapsDir, { ext: ".json" }).filter((f) => !f.startsWith("."));
}

function statusToIcon(status: "OK" | "WARN" | "FAIL"): string {
    if (status === "WARN") return ICONS.warningIcon;
    if (status === "FAIL") return ICONS.failIcon;
    return ICONS.successIcon;
}

function shouldExpandPage(opts: {
    verbose: boolean;
    pageErrors: string[];
    pageWarnings: string[];
}): boolean {
    return opts.verbose || opts.pageErrors.length > 0 || opts.pageWarnings.length > 0;
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
        logLevel: verbose ? "debug" : "info",
        withTimestamp: true,
    });

    log.info("Command: validate");

    const mapsDir = getArg(argv, "--mapsDir") ?? PAGE_MAPS_DIR;
    const pagesDir = getArg(argv, "--pagesDir") ?? PAGES_DIR;

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
    printStatus(ICONS.successIcon, `Found ${mapFiles.length} page-map(s)`);

    let ok = 0;
    let bad = 0;
    let warnOnly = 0;
    let warnCount = 0;
    let errorCount = 0;

    printSection("Validating pages");
    console.log(
        info(
            "Page Map → Elements → Generated Aliases → Business Aliases → Page Object → Structure"
        )
    );
    console.log("");

    for (const mf of mapFiles) {
        const res = validateOnePage({ mapsDir, pagesDir, mapFile: mf });

        const pageKey =
            safeReadJson<PageMapLite>(path.join(mapsDir, mf))?.pageKey ??
            mf.replace(/\.json$/, "");

        const registryRes = checkPageRegistry({ pageKey, pagesDir });

        const pageErrors = [...res.errors, ...registryRes.errors];
        const pageWarnings = [...res.warnings, ...registryRes.warnings];

        warnCount += pageWarnings.length;
        errorCount += pageErrors.length;

        if (pageErrors.length > 0) {
            bad++;
            printStatus(failure(strong(ICONS.failIcon)), strong(pageKey));
        } else if (pageWarnings.length > 0) {
            warnOnly++;
            printStatus(warning(strong(ICONS.warningIcon)), strong(pageKey));
        } else {
            ok++;
            printStatus(success(strong(ICONS.successIcon)), strong(pageKey));
        }

        if (shouldExpandPage({ verbose, pageErrors, pageWarnings })) {
            const treeSteps = res.steps.map((step) => ({
                icon: statusToIcon(step.status),
                title: step.step,
                summary: step.summary,
            }));

            printTree(treeSteps);

            if (registryRes.warnings.length > 0) {
                for (const w of registryRes.warnings) {
                    console.log(`   ${ICONS.warningIcon} Registry : ${w}`);
                }
            }

            if (registryRes.errors.length > 0) {
                for (const e of registryRes.errors) {
                    console.log(`   ${ICONS.failIcon} Registry : ${e}`);
                }
            }

            if (verbose) {
                for (const step of res.steps) {
                    for (const m of step.messages) {
                        log.debug(`${pageKey}: ${m}`);
                    }
                }

                for (const w of registryRes.warnings) {
                    log.debug(`${pageKey}: registry warning: ${w}`);
                }

                for (const e of registryRes.errors) {
                    log.debug(`${pageKey}: registry error: ${e}`);
                }
            }

            console.log("");
        }
    }

    if (checkModuleHygiene) {
        printSection("Module hygiene");

        const pagesH = checkPagesModuleHygiene(pagesDir);
        warnCount += pagesH.warnings.length;
        errorCount += pagesH.errors.length;

        if (pagesH.errors.length === 0 && pagesH.warnings.length === 0) {
            printStatus(ICONS.successIcon, "src/pages/index.ts / pageManager.ts");
        } else {
            if (pagesH.warnings.length > 0) {
                printStatus(ICONS.warningIcon, "src/pages/index.ts / pageManager.ts");
                for (const w of pagesH.warnings) {
                    console.log(`   ${ICONS.warningIcon} ${w}`);
                    if (verbose) {
                        log.debug(`module hygiene: ${w}`);
                    }
                }
            }

            if (pagesH.errors.length > 0) {
                bad++;
                printStatus(ICONS.failIcon, "src/pages/index.ts / pageManager.ts");
                for (const e of pagesH.errors) {
                    console.log(`   ${ICONS.failIcon} ${e}`);
                    if (verbose) {
                        log.debug(`module hygiene: ${e}`);
                    }
                }
            }
        }

        console.log("");
    }

    let resultText: string;

    if (errorCount > 0) {
        resultText = failure("ERROR FOUND");
    } else if (warnCount > 0) {
        resultText = warning("WARNING FOUND");
    } else {
        resultText = success("ALL GOOD");
    }

    printSummary(
        "VALIDATE SUMMARY",
        [
            ["Pages checked", mapFiles.length],
            ["Clean pages", ok],
            ["Warn pages", warnOnly],
            ["Error pages", bad],
            ["Total warnings", warnCount],
            ["Total errors", errorCount],
            ["Strict mode", strict ? "ON" : "OFF"],
        ],
        resultText
    );

    if (bad > 0) process.exit(1);

    if (strict && warnCount > 0) {
        log.error(`Strict mode: warnings found (${warnCount}).`);
        process.exit(1);
    }
}