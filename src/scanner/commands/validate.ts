// src/scanner/commands/validate.ts

import fs from "node:fs";
import path from "node:path";
import { createLogger } from "../logger";
import type { PageMap } from "../elements-generator/types";
import {
    pageKeyToFolder,
    mapPageKeyToAliasesGeneratedPath,
    mapPageKeyToAliasesHumanPath,
    mapPageKeyToElementsPath,
    mapPageKeyToPageTsPath,
} from "../elements-generator/paths";

function usage() {
    return `
scanner validate

Usage:
  ts-node src/scanner/cli.ts validate [options]

Options:
  --mapsDir <path>   default: src/page-maps
  --pagesDir <path>  default: src/pages
  --verbose
  --help

What it validates:
  - Each page-map has generated outputs:
    - elements.ts
    - aliases.generated.ts
    - aliases.ts (create-only, but should exist once scaffolded)
    - <PageClass>.ts (create-only, but should exist once scaffolded)
`.trim();
}

function getArg(argv: string[], name: string): string | undefined {
    const i = argv.indexOf(name);
    if (i >= 0) return argv[i + 1];

    const eq = argv.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return undefined;
}

function hasFlag(argv: string[], name: string) {
    return argv.includes(name);
}

function safeReadJson<T>(file: string): T | null {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export async function runValidateCommand(args: string[]) {
    const verbose = hasFlag(args, "--verbose");
    const log = createLogger({ prefix: "[scanner]", verbose, withTimestamp: true });

    if (hasFlag(args, "--help") || hasFlag(args, "-h")) {
        log.info(usage());
        return;
    }

    const mapsDir = getArg(args, "--mapsDir") ?? path.join(process.cwd(), "src", "page-maps");
    const pagesDir = getArg(args, "--pagesDir") ?? path.join(process.cwd(), "src", "pages");

    log.info("Command: validate");

    if (!fs.existsSync(mapsDir)) {
        log.error(`mapsDir not found: ${mapsDir}`);
        process.exitCode = 2;
        return;
    }

    const mapFiles = fs.readdirSync(mapsDir).filter((f) => f.endsWith(".json") && !f.startsWith("."));
    log.info(`Found ${mapFiles.length} page-map(s).`);

    let okCount = 0;
    let badCount = 0;

    for (const f of mapFiles) {
        const abs = path.join(mapsDir, f);
        const pm = safeReadJson<PageMap>(abs);

        if (!pm?.pageKey) {
            badCount++;
            log.error(`Invalid page-map (missing pageKey): ${f}`);
            continue;
        }

        const folder = pageKeyToFolder(pagesDir, pm.pageKey);
        const elementsPath = mapPageKeyToElementsPath(pagesDir, pm.pageKey);
        const aliasesGenPath = mapPageKeyToAliasesGeneratedPath(pagesDir, pm.pageKey);
        const aliasesHumanPath = mapPageKeyToAliasesHumanPath(pagesDir, pm.pageKey);
        const pageTsPath = mapPageKeyToPageTsPath(pagesDir, pm.pageKey);

        const missing: string[] = [];
        if (!fs.existsSync(folder)) missing.push(`folder: ${folder}`);
        if (!fs.existsSync(elementsPath)) missing.push(`elements.ts: ${elementsPath}`);
        if (!fs.existsSync(aliasesGenPath)) missing.push(`aliases.generated.ts: ${aliasesGenPath}`);
        if (!fs.existsSync(aliasesHumanPath)) missing.push(`aliases.ts: ${aliasesHumanPath}`);
        if (!fs.existsSync(pageTsPath)) missing.push(`page stub: ${pageTsPath}`);

        if (missing.length) {
            badCount++;
            log.error(`❌ ${pm.pageKey} missing outputs:`);
            for (const m of missing) log.error(`   - ${m}`);
        } else {
            okCount++;
            if (verbose) log.info(`✅ ${pm.pageKey} OK`);
        }
    }

    log.info(`Validate summary: ok=${okCount} bad=${badCount}`);

    if (badCount > 0) {
        log.info(`Fix suggestion: run "scanner repair --merge --changedOnly"`);
        process.exitCode = 2;
    }
}