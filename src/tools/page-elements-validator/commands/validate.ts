// src/page-elements-validator/commands/validate.ts

import fs from "node:fs";
import path from "node:path";
import { createLogger } from "../logger";

import { validateOnePage } from "../validators/pageOutputs";
import { checkPagesIndexHygiene } from "../validators/indexHygiene";

// NOTE: validator CLI owns argv parsing now (no ./argv in this package)
function normalizeArgv(argv: string[]): string[] {
    // npm/yarn may inject standalone "--"
    return argv.filter((a) => a !== "--");
}

function hasFlag(argv: string[], name: string): boolean {
    return normalizeArgv(argv).includes(name);
}

function getArg(argv: string[], name: string): string | undefined {
    const args = normalizeArgv(argv);

    const i = args.indexOf(name);
    if (i >= 0) {
        const v = args[i + 1];
        if (!v || v.startsWith("--")) return undefined;
        return v;
    }

    const eq = args.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return undefined;
}

type PageMapLite = { pageKey: string };

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

    const log = createLogger({ prefix: "[validator]", verbose, withTimestamp: true });

    log.info("Command: validate");

    // ✅ default now points to page-scanner output
    const mapsDir =
        getArg(args, "--mapsDir") ??
        path.join(process.cwd(), "src", "tools", "page-scanner", "page-maps");

    const pagesDir =
        getArg(args, "--pagesDir") ?? path.join(process.cwd(), "src", "pages");

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