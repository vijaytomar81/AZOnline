// src/tools/page-elements-validator/commands/validate.ts

import fs from "node:fs";
import path from "node:path";

import { createLogger } from "../../../utils/logger";
import { normalizeArgv, hasFlag, getArg } from "../../../utils/argv";
import { safeReadJson, listFiles } from "../../../utils/fs";

import { validateOnePage } from "../validators/pageOutputs";
import { checkPagesIndexHygiene } from "../validators/indexHygiene";

type PageMapLite = { pageKey: string };

function listPageMapFiles(mapsDir: string): string[] {
    return listFiles(mapsDir, { ext: ".json" }).filter((f) => !f.startsWith("."));
}

export async function runValidateCommand(args: string[]) {
    const argv = normalizeArgv(args);

    const verbose = hasFlag(argv, "--verbose");
    const strict = hasFlag(argv, "--strict");
    const checkIndex = !hasFlag(argv, "--noIndexHygiene");

    const log = createLogger({
        prefix: "[validator - validate]",
        verbose,
        withTimestamp: true,
    });

    log.info("Command: validate");

    // ✅ default now points to page-scanner output
    const mapsDir =
        getArg(argv, "--mapsDir") ??
        path.join(process.cwd(), "src", "tools", "page-scanner", "page-maps");

    const pagesDir =
        getArg(argv, "--pagesDir") ?? path.join(process.cwd(), "src", "pages");

    if (!fs.existsSync(mapsDir)) {
        log.error(`mapsDir not found: ${mapsDir}`);
        process.exit(1);
    }
    if (!fs.existsSync(pagesDir)) {
        log.error(`pagesDir not found: ${pagesDir}`);
        process.exit(1);
    }

    const mapFiles = listPageMapFiles(mapsDir);
    log.info(`Found ${mapFiles.length} page-map(s).`);

    let ok = 0;
    let bad = 0;
    let warnCount = 0;

    for (const mf of mapFiles) {
        const res = validateOnePage({ mapsDir, pagesDir, mapFile: mf });

        const pageKey =
            safeReadJson<PageMapLite>(path.join(mapsDir, mf))?.pageKey ??
            mf.replace(/\.json$/, "");

        if (res.ok) {
            ok++;
            log.info(`✅ ${pageKey} OK`);
        } else {
            bad++;
            log.error(`❌ ${pageKey} FAILED`);
        }

        for (const w of res.warnings) {
            warnCount++;
            if (verbose) log.debug(`WARN: ${pageKey}: ${w}`);
            else log.info(`⚠️  ${pageKey}: ${w}`);
        }

        for (const e of res.errors) {
            log.error(`${pageKey}: ${e}`);
        }
    }

    // ✅ index hygiene checks (pages only)
    if (checkIndex) {
        const pagesH = checkPagesIndexHygiene(pagesDir);
        warnCount += pagesH.warnings.length;

        for (const w of pagesH.warnings) {
            if (verbose) log.debug(`WARN: ${w}`);
            else log.info(`⚠️  ${w}`);
        }
        for (const e of pagesH.errors) {
            bad++;
            log.error(`❌ ${e}`);
        }
    }

    log.info(`Validate summary: ok=${ok} bad=${bad} warnings=${warnCount}`);

    if (bad > 0) process.exit(1);

    if (strict && warnCount > 0) {
        log.error(`Strict mode: warnings found (${warnCount}).`);
        process.exit(1);
    }
}