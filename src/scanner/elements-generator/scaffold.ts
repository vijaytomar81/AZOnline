// src/scanner/elements-generator/scaffold.ts

import fs from "node:fs";
import path from "node:path";

import type { PageMap } from "./types";
import type { Logger } from "../logger";

import {
    pageKeyToFolder,
    mapPageKeyToAliasesGeneratedPath,
    mapPageKeyToAliasesHumanPath,
    mapPageKeyToPageTsPath,
    mapPageKeyToElementsPath,
} from "./paths";

import { buildAliasesGeneratedTs } from "./builders/buildAliasesGeneratedTs";
import { buildAliasesHumanTs } from "./builders/buildAliasesHumanTs";
import { buildPageTsStub } from "./builders/buildPageTsStub";

function ensureDir(dir: string) {
    fs.mkdirSync(dir, { recursive: true });
}

function safeWriteText(file: string, content: string) {
    ensureDir(path.dirname(file));
    fs.writeFileSync(file, content, "utf8");
}

function safeWriteTextIfMissing(file: string, content: string): boolean {
    if (fs.existsSync(file)) return false;
    safeWriteText(file, content);
    return true;
}

/**
 * Extract element keys already mapped in aliases.ts by scanning RHS:
 *   aliasesGenerated.<elementKey>
 */
function extractCoveredElementKeysFromAliasesTs(content: string): Set<string> {
    const covered = new Set<string>();
    const re = /\baliasesGenerated\.([A-Za-z_$][A-Za-z0-9_$]*)\b/g;

    let m: RegExpExecArray | null;
    while ((m = re.exec(content))) {
        if (m[1]) covered.add(m[1]);
    }
    return covered;
}

function isValidTsIdentifier(key: string) {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}

/**
 * Append missing mappings into aliases.ts without touching existing ones.
 * Inserts before the closing `} as Record<string, ElementKey>;`
 */
function appendMissingAliasMappings(opts: {
    aliasesHumanPath: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: Logger;
}) {
    const { aliasesHumanPath, pageMap, verbose, log } = opts;

    if (!fs.existsSync(aliasesHumanPath)) return;

    const content = fs.readFileSync(aliasesHumanPath, "utf8");
    const covered = extractCoveredElementKeysFromAliasesTs(content);

    const generatedKeys = Object.keys(pageMap.elements).sort((a, b) => a.localeCompare(b));
    const missing = generatedKeys.filter((k) => !covered.has(k));

    if (!missing.length) {
        if (verbose) log.debug(`Aliases OK (no new keys): ${aliasesHumanPath}`);
        return;
    }

    const insertAnchor = `} as Record<string, ElementKey>;`;
    const idx = content.indexOf(insertAnchor);
    if (idx < 0) {
        // Don’t risk corrupting a heavily customized file
        log.error(
            `Could not auto-append aliases (anchor not found). Please add manually: ${aliasesHumanPath}`
        );
        return;
    }

    const additions = missing
        .map((k) => {
            const prop = isValidTsIdentifier(k) ? k : JSON.stringify(k);
            return `  ${prop}: aliasesGenerated.${k},`;
        })
        .join("\n");

    const updated =
        content.slice(0, idx) +
        additions +
        "\n" +
        content.slice(idx);

    fs.writeFileSync(aliasesHumanPath, updated, "utf8");
    log.info(`Updated aliases.ts (added ${missing.length} new alias(es)): ${aliasesHumanPath}`);
}

export function hasMissingGeneratedOutputs(opts: { pagesDir: string; pageKey: string }): boolean {
    const { pagesDir, pageKey } = opts;

    const elementsPath = mapPageKeyToElementsPath(pagesDir, pageKey);
    const aliasesGenPath = mapPageKeyToAliasesGeneratedPath(pagesDir, pageKey);
    const aliasesHumanPath = mapPageKeyToAliasesHumanPath(pagesDir, pageKey);
    const pageTsPath = mapPageKeyToPageTsPath(pagesDir, pageKey);

    return (
        !fs.existsSync(elementsPath) ||
        !fs.existsSync(aliasesGenPath) ||
        !fs.existsSync(aliasesHumanPath) ||
        !fs.existsSync(pageTsPath)
    );
}

export function ensureScaffoldFiles(opts: {
    pagesDir: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: Logger;
}) {
    const { pagesDir, pageMap, verbose, log } = opts;

    const pageFolder = pageKeyToFolder(pagesDir, pageMap.pageKey);
    ensureDir(pageFolder);

    const aliasesGenPath = mapPageKeyToAliasesGeneratedPath(pagesDir, pageMap.pageKey);
    const aliasesHumanPath = mapPageKeyToAliasesHumanPath(pagesDir, pageMap.pageKey);
    const pageTsPath = mapPageKeyToPageTsPath(pagesDir, pageMap.pageKey);

    // 1) aliases.ts (create-only), BUT also merge in new keys safely later
    const createdAliases = safeWriteTextIfMissing(aliasesHumanPath, buildAliasesHumanTs(pageMap));
    if (createdAliases) {
        log.info(`Scaffolded: ${aliasesHumanPath}`);
    } else {
        // ✅ merge new element keys into existing aliases.ts without breaking human renames
        appendMissingAliasMappings({ aliasesHumanPath, pageMap, verbose, log });
    }

    // 2) Page object stub (create-only)
    const createdPage = safeWriteTextIfMissing(pageTsPath, buildPageTsStub(pageMap));
    if (createdPage) log.info(`Scaffolded: ${pageTsPath}`);

    // 3) aliases.generated.ts (overwrite-safe)
    safeWriteText(aliasesGenPath, buildAliasesGeneratedTs(pageMap));
    if (verbose) log.debug(`Generated: ${aliasesGenPath}`);
}