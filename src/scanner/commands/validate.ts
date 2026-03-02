// src/scanner/commands/validate.ts

import fs from "node:fs";
import path from "node:path";
import { createLogger } from "../logger";

import { validateOnePage } from "../validators/pageOutputs";
import { checkPagesIndexHygiene, checkScannerIndexHygiene } from "../validators/indexHygiene";

type PageMapLite = { pageKey: string };

function getArg(argv: string[], name: string): string | undefined {
    const i = argv.indexOf(name);
    if (i >= 0) return argv[i + 1];

    const eq = argv.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return undefined;
}

function hasFlag(argv: string[], name: string): boolean {
    return argv.includes(name);
}

function safeReadJson<T>(filePath: string): T | null {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function listPageMapFiles(mapsDir: string): string[] {
    if (!fs.existsSync(mapsDir)) return [];
    return fs
        .readdirSync(mapsDir)
        .filter((f) => f.endsWith(".json") && !f.startsWith("."))
        .sort((a, b) => a.localeCompare(b));
}

export async function runValidateCommand(args: string[]) {
    const verbose = hasFlag(args, "--verbose");
    const strict = hasFlag(args, "--strict");
    const checkIndex = !hasFlag(args, "--noIndexHygiene");

    const log = createLogger({ prefix: "[scanner]", verbose, withTimestamp: true });
    log.info("Command: validate");

    const mapsDir = getArg(args, "--mapsDir") ?? path.join(process.cwd(), "src", "page-maps");
    const pagesDir = getArg(args, "--pagesDir") ?? path.join(process.cwd(), "src", "pages");

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
            safeReadJson<PageMapLite>(path.join(mapsDir, mf))?.pageKey ?? mf.replace(/\.json$/, "");

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

    // index hygiene checks
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

        const scannerH = checkScannerIndexHygiene();
        warnCount += scannerH.warnings.length;

        for (const w of scannerH.warnings) {
            if (verbose) log.debug(`WARN: ${w}`);
            else log.info(`⚠️  ${w}`);
        }
        for (const e of scannerH.errors) {
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