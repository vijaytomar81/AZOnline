// src/tools/page-elements-validator/commands/doctor.ts

import fs from "node:fs";

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
    printSummary,
    success,
    failure,
    strong,
} from "../../../utils/cliFormat";

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
        verbose,
        withTimestamp: true,
    });

    const mapsDir =
        getArg(argv, "--mapsDir") ?? PAGE_SCANNER_MAPS_DIR;

    const pagesDir =
        getArg(argv, "--pagesDir") ?? PAGES_DIR;

    const stateDir =
        getArg(argv, "--stateDir") ?? PAGE_ELEMENTS_GENERATOR_STATE_DIR;

    const stateFile =
        getArg(argv, "--stateFile") ?? PAGE_ELEMENTS_GENERATOR_STATE_FILE;

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
            printStatus("✓", c.name);
            if (verbose) {
                console.log(`  ${c.detail}`);
            }
        } else {
            badCount++;
            printStatus("❌", c.name);
            console.log(`  ${c.detail}`);
        }
    }

    const failed = checks.filter((c) => !c.ok);

    if (failed.length > 0) {
        printSection("Suggested actions");

        for (const f of failed) {
            if (f.name === "mapsDir exists") {
                console.log(`- Create: mkdir -p ${mapsDir}`);
            }

            if (f.name === "pagesDir exists") {
                console.log(`- Create: mkdir -p ${pagesDir}`);
            }

            if (f.name === "stateDir exists") {
                console.log(`- Create: mkdir -p ${stateDir}`);
            }

            if (f.name === "stateFile exists") {
                console.log(
                    "- Run generator state-only to create state file: " +
                    "node -r ts-node/register src/tools/page-elements-generator/cli.ts generate --stateOnly --verbose"
                );
            }

            if (f.name === "page-maps found") {
                console.log(
                    '- Run a scan first: ' +
                    'node -r ts-node/register src/tools/page-scanner/cli.ts scan --connectCdp "$CDP" --pageKey <key> --merge'
                );
            }

            if (f.name.endsWith("writable")) {
                console.log(`- Fix permissions for: ${f.detail}`);
            }
        }
    }

    printSummary("DOCTOR SUMMARY", [
        ["Checks passed", okCount],
        ["Checks failed", badCount],
    ]);

    console.log(
        `${strong("Result".padEnd(20, " "))}: ${badCount > 0 ? failure("ISSUES FOUND") : success("HEALTHY")}`
    );

    if (badCount === 0) {
        console.log("Next: npm run gen:elements:changed:verbose (or run the generator CLI directly)");
        return;
    }

    process.exitCode = 2;
}