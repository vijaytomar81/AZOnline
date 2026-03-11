// src/tools/page-elements-generator/generator/scaffold.ts

import fs from "node:fs";
import path from "node:path";

import type { PageMap } from "./types";
import {
    pageKeyToFolder,
    mapPageKeyToAliasesGeneratedPath,
    mapPageKeyToAliasesHumanPath,
    mapPageKeyToPageTsPath,
} from "./paths";

import { safeWriteText, safeWriteTextIfMissing } from "./state";
import { ensureDir } from "../../../utils/fs";
import { isValidTsIdentifier } from "../../../utils/ts";
import { stripLineComments } from "../../../utils/text";
import { buildAliasesGeneratedTs } from "../builders/buildAliasesGeneratedTs";
import { buildAliasesHumanTs } from "../builders/buildAliasesHumanTs";
import { buildPageTsStub } from "../builders/buildPageTsStub";
import { syncAliasesIntoPageObject } from "./pageObject";

function toPropertyAccess(objectName: string, key: string): string {
    return isValidTsIdentifier(key)
        ? `${objectName}.${key}`
        : `${objectName}[${JSON.stringify(key)}]`;
}

function extractAliasKeysFromAliasesTs(aliasesHumanTs: string): Set<string> {
    const aliasKeys = new Set<string>();
    const obj = extractAliasesObjectBody(aliasesHumanTs);
    if (!obj) return aliasKeys;

    const body = stripLineComments(obj.body);

    // Matches:
    //   back:
    //   next:
    //   "1":
    //   "driverClaims":
    const re = /(?:^|\n)\s*(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][A-Za-z0-9_$]*))\s*:/g;

    let m: RegExpExecArray | null;
    while ((m = re.exec(body))) {
        const quotedDouble = m[1];
        const quotedSingle = m[2];
        const identifier = m[3];
        const key = quotedDouble ?? quotedSingle ?? identifier;
        if (key) aliasKeys.add(key);
    }

    return aliasKeys;
}

/**
 * Detect which element keys are already mapped in aliases.ts by checking RHS usage:
 *   aliasesGenerated.<elementKey>
 *
 * This is what allows humans to rename the LHS alias key without duplicates being re-added.
 */
function extractMappedElementKeysFromAliasesTs(aliasesHumanTs: string): Set<string> {
    const mapped = new Set<string>();
    const cleaned = stripLineComments(aliasesHumanTs);

    // matches:
    //   aliasesGenerated.back
    //   aliasesGenerated["2"]
    //   aliasesGenerated['2']
    const re =
        /\baliasesGenerated(?:\.([A-Za-z_$][A-Za-z0-9_$]*)|\[(?:"([^"]+)"|'([^']+)')\])/g;

    let m: RegExpExecArray | null;
    while ((m = re.exec(cleaned))) {
        const dotKey = m[1];
        const bracketDouble = m[2];
        const bracketSingle = m[3];
        const key = dotKey ?? bracketDouble ?? bracketSingle;
        if (key) mapped.add(key);
    }

    return mapped;
}

/**
 * Extracts the body of:
 *   export const aliases = { ... }
 *
 * Supports BOTH endings:
 *  - } as Record<string, ElementKey>;
 *  - } as const satisfies Record<string, ElementKey>;
 */
function extractAliasesObjectBody(aliasesHumanTs: string): { body: string; bodyStartIndex: number; bodyEndIndex: number } | null {
    const cleaned = aliasesHumanTs; // keep original indices stable (don’t strip comments here)

    // capture { BODY } and allow flexible suffix
    const re =
        /export\s+const\s+aliases\s*=\s*\{([\s\S]*?)\}\s*(?:as\s+const\s+satisfies\s+Record<string,\s*ElementKey>|as\s+Record<string,\s*ElementKey>)\s*;/m;

    const m = cleaned.match(re);
    if (!m || typeof m.index !== "number") return null;

    const fullMatch = m[0];
    const body = m[1] ?? "";

    // Find body location inside the fullMatch to compute absolute indices
    const relBodyStart = fullMatch.indexOf(body);
    const relBodyEnd = relBodyStart + body.length;

    const absStart = m.index + relBodyStart;
    const absEnd = m.index + relBodyEnd;

    return { body, bodyStartIndex: absStart, bodyEndIndex: absEnd };
}

/**
 * Appends new mappings into aliases.ts (inside export const aliases = { ... }).
 * It does NOT rewrite existing mappings.
 *
 * Key behavior: detect duplicates by RHS (aliasesGenerated.<elementKey>), so alias renames are safe.
 */
function appendNewAliases(params: {
    aliasesHumanPath: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: { info: (s: string) => void; debug?: (s: string) => void };
}) {
    const { aliasesHumanPath, pageMap, verbose, log } = params;

    if (!fs.existsSync(aliasesHumanPath)) return;

    const txt = fs.readFileSync(aliasesHumanPath, "utf8");
    const mapped = extractMappedElementKeysFromAliasesTs(txt);
    const existingAliasKeys = extractAliasKeysFromAliasesTs(txt);

    const elementKeys = Object.keys(pageMap.elements).sort((a, b) => a.localeCompare(b));
    const missing = elementKeys.filter((k) => !mapped.has(k) && !existingAliasKeys.has(k));

    if (missing.length === 0) {
        if (verbose) log.debug?.(`aliases.ts up-to-date: ${aliasesHumanPath}`);
        return;
    }

    const obj = extractAliasesObjectBody(txt);
    if (!obj) {
        log.info(`WARN: Could not parse aliases.ts to append new keys: ${aliasesHumanPath}`);
        return;
    }

    // Insert right before the closing "}" of the aliases object body.
    // obj.bodyEndIndex points to end of captured BODY, which is right before the "}".
    const insertAt = obj.bodyEndIndex;

    const lines: string[] = [];
    lines.push(``);
    for (const k of missing) {
        const prop = isValidTsIdentifier(k) ? k : JSON.stringify(k);
        const rhs = toPropertyAccess("aliasesGenerated", k);
        lines.push(`  ${prop}: ${rhs},`);
    }

    const updated = txt.slice(0, insertAt) + lines.join("\n") + txt.slice(insertAt);

    fs.writeFileSync(aliasesHumanPath, updated, "utf8");
    log.info(`Updated aliases.ts (appended ${missing.length} new mapping(s)): ${aliasesHumanPath}`);
}

export function hasMissingGeneratedOutputs(params: { pagesDir: string; pageKey: string }): boolean {
    const { pagesDir, pageKey } = params;

    const folder = pageKeyToFolder(pagesDir, pageKey);
    const aliasesHumanPath = mapPageKeyToAliasesHumanPath(pagesDir, pageKey);
    const aliasesGenPath = mapPageKeyToAliasesGeneratedPath(pagesDir, pageKey);
    const pageTsPath = mapPageKeyToPageTsPath(pagesDir, pageKey);

    // NOTE: elements.ts is generated in runner.ts (not scaffold.ts)
    const required = [folder, aliasesHumanPath, aliasesGenPath, pageTsPath];

    for (const p of required) {
        if (!fs.existsSync(p)) return true;
    }
    return false;
}

export function ensureScaffoldFiles(params: {
    pagesDir: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: { info: (s: string) => void; debug?: (s: string) => void };
}) {
    const { pagesDir, pageMap, verbose, log } = params;

    const pageFolder = pageKeyToFolder(pagesDir, pageMap.pageKey);
    ensureDir(pageFolder);

    const aliasesHumanPath = mapPageKeyToAliasesHumanPath(pagesDir, pageMap.pageKey);
    const aliasesGenPath = mapPageKeyToAliasesGeneratedPath(pagesDir, pageMap.pageKey);
    const pageTsPath = mapPageKeyToPageTsPath(pagesDir, pageMap.pageKey);

    // 1) aliases.ts (create-only)
    const createdAliases = safeWriteTextIfMissing(aliasesHumanPath, buildAliasesHumanTs(pageMap));
    if (createdAliases) log.info(`Scaffolded: ${aliasesHumanPath}`);

    // If already exists, append only new element mappings
    if (!createdAliases) {
        appendNewAliases({ aliasesHumanPath, pageMap, verbose, log });
    }

    // 2) Page object (create-only)
    const createdPage = safeWriteTextIfMissing(pageTsPath, buildPageTsStub(pageMap));
    if (createdPage) log.info(`Scaffolded: ${pageTsPath}`);

    // 3) aliases.generated.ts (always overwrite-safe)
    safeWriteText(aliasesGenPath, buildAliasesGeneratedTs(pageMap));
    if (verbose) log.debug?.(`Generated: ${aliasesGenPath}`);

    // 4) Always sync methods region from aliases.ts into page object
    syncAliasesIntoPageObject({
        pageTsPath,
        pageMap,
        aliasesTsPath: aliasesHumanPath,
    });

    if (verbose) {
        log.debug?.(`Synced page object aliases region: ${path.relative(process.cwd(), pageTsPath)}`);
    }
}