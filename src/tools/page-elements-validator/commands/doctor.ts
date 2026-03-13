// src/tools/page-elements-validator/commands/doctor.ts

import fs from "node:fs";

import { createLogger } from "@/utils/logger";
import { normalizeArgv, hasFlag, getArg } from "@/utils/argv";
import { ICONS } from "@/utils/icons";
import {
    PAGE_MAP_STATE_DIR,
    PAGE_MAP_STATE_FILE,
    PAGE_MAPS_DIR,
    PAGES_DIR,
} from "@/utils/paths";
import {
    printSection,
    printKeyValue,
    printStatus,
    printSummary,
    success,
    failure,
    strong,
    info,
} from "@/utils/cliFormat";

function exists(p: string) {
    return fs.existsSync(p);
}

function canWrite(dir: string) {
    try {
        fs.accessSync(dir, fs.constants.W_OK);
        return true;
    } catch {
        return false;
    }
}

export async function runDoctorCommand(args: string[]) {
    const argv = normalizeArgv(args);

    const verbose = hasFlag(argv, "--verbose");

    const log = createLogger({
        prefix: "[validator - doctor]",
        logLevel: verbose ? "debug" : "info",
        withTimestamp: true,
    });

    const mapsDir =
        getArg(argv, "--mapsDir") ?? PAGE_MAPS_DIR;

    const pagesDir =
        getArg(argv, "--pagesDir") ?? PAGES_DIR;

    const stateDir =
        getArg(argv, "--stateDir") ?? PAGE_MAP_STATE_DIR;

    const stateFile =
        getArg(argv, "--stateFile") ?? PAGE_MAP_STATE_FILE;

    log.info("Command: doctor");

    printSection("Environment");
    printKeyValue("Node", process.version);
    printKeyValue("cwd", process.cwd());
    printKeyValue("mapsDir", mapsDir);
    printKeyValue("pagesDir", pagesDir);
    printKeyValue("stateDir", stateDir);
    printKeyValue("stateFile", stateFile);

    const checks: Array<{ name: string; ok: boolean; detail: string }> = [];

    checks.push({ name: "mapsDir exists", ok: exists(mapsDir), detail: mapsDir });
    checks.push({ name: "pagesDir exists", ok: exists(pagesDir), detail: pagesDir });
    checks.push({ name: "stateDir exists", ok: exists(stateDir), detail: stateDir });
    checks.push({ name: "stateFile exists", ok: exists(stateFile), detail: stateFile });

    if (exists(mapsDir)) {
        checks.push({ name: "mapsDir writable", ok: canWrite(mapsDir), detail: mapsDir });
    }
    if (exists(pagesDir)) {
        checks.push({ name: "pagesDir writable", ok: canWrite(pagesDir), detail: pagesDir });
    }
    if (exists(stateDir)) {
        checks.push({ name: "stateDir writable", ok: canWrite(stateDir), detail: stateDir });
    }

    if (exists(mapsDir)) {
        const maps = fs
            .readdirSync(mapsDir)
            .filter((f) => f.endsWith(".json") && !f.startsWith("."));

        checks.push({
            name: "page-maps found",
            ok: maps.length > 0,
            detail: `${maps.length} file(s)`,
        });
    }

    let okCount = 0;
    let badCount = 0;

    printSection("Checks");

    for (const c of checks) {
        if (c.ok) {
            okCount++;
            printStatus(ICONS.successIcon, c.name);

            if (verbose) {
                log.debug(c.detail);
            }
        } else {
            badCount++;
            printStatus(ICONS.failIcon, c.name);

            if (verbose) {
                log.debug(c.detail);
            } else {
                console.log(`   ${info(c.detail)}`);
            }
        }
    }

    const failed = checks.filter((c) => !c.ok);

    if (failed.length > 0) {
        printSection("Suggested actions");

        for (const f of failed) {
            if (f.name === "mapsDir exists") {
                console.log(`   ${ICONS.hintIcon} Create : mkdir -p ${mapsDir}`);
            }

            if (f.name === "pagesDir exists") {
                console.log(`   ${ICONS.hintIcon} Create : mkdir -p ${pagesDir}`);
            }

            if (f.name === "stateDir exists") {
                console.log(`   ${ICONS.hintIcon} Create : mkdir -p ${stateDir}`);
            }

            if (f.name === "stateFile exists") {
                console.log(
                    `   ${ICONS.hintIcon} Run    : node -r ts-node/register src/tools/page-elements-generator/cli.ts generate --stateOnly --verbose`
                );
            }

            if (f.name === "page-maps found") {
                console.log(
                    `   ${ICONS.hintIcon} Run    : node -r ts-node/register src/tools/page-scanner/cli.ts scan --connectCdp "$CDP" --pageKey <key> --merge`
                );
            }

            if (f.name.endsWith("writable")) {
                console.log(`   ${ICONS.hintIcon} Fix    : permissions for ${f.detail}`);
            }
        }

        console.log("");
    }

    let resultText: string;

    if (badCount > 0) {
        resultText = failure("ISSUE FOUND");
    } else {
        resultText = success("ALL GOOD");
    }

    printSummary(
        "DOCTOR SUMMARY",
        [
            ["Maps dir", exists(mapsDir) ? success("OK") : failure("MISSING")],
            ["Pages dir", exists(pagesDir) ? success("OK") : failure("MISSING")],
            ["State dir", exists(stateDir) ? success("OK") : failure("MISSING")],
            ["State file", exists(stateFile) ? success("OK") : failure("MISSING")],
            ["Checks passed", okCount],
            ["Checks failed", badCount],
        ],
        resultText
    );

    if (failed.length === 0) {
        console.log(`${ICONS.doneIcon} ${strong("Doctor checks completed successfully")}`);
        process.exitCode = 0;
        return;
    }

    process.exitCode = 2;
}