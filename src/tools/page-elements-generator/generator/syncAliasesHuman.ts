// src/tools/page-elements-generator/generator/syncAliasesHuman.ts
import fs from "node:fs";

import type { PageMap } from "./types";
import { isValidTsIdentifier } from "@/utils/ts";
import { stripLineComments } from "@/utils/text";

type SyncLog = {
    info: (s: string) => void;
    debug?: (s: string) => void;
};

type AliasEntry = {
    rawLine: string;
    aliasKey: string | null;
    generatedKey: string | null;
};

function toPropertyAccess(objectName: string, key: string): string {
    return isValidTsIdentifier(key)
        ? `${objectName}.${key}`
        : `${objectName}[${JSON.stringify(key)}]`;
}

/**
 * Extracts the body of:
 *   export const aliases = { ... }
 *
 * Supports BOTH endings:
 *  - } as Record<string, ElementKey>;
 *  - } as const satisfies Record<string, ElementKey>;
 */
function extractAliasesObjectBody(
    aliasesHumanTs: string
): { body: string; bodyStartIndex: number; bodyEndIndex: number } | null {
    const cleaned = aliasesHumanTs;

    const re =
        /export\s+const\s+aliases\s*=\s*\{([\s\S]*?)\}\s*(?:as\s+const\s+satisfies\s+Record<string,\s*ElementKey>|as\s+Record<string,\s*ElementKey>)\s*;/m;

    const m = cleaned.match(re);
    if (!m || typeof m.index !== "number") return null;

    const fullMatch = m[0];
    const body = m[1] ?? "";

    const relBodyStart = fullMatch.indexOf(body);
    const relBodyEnd = relBodyStart + body.length;

    const absStart = m.index + relBodyStart;
    const absEnd = m.index + relBodyEnd;

    return { body, bodyStartIndex: absStart, bodyEndIndex: absEnd };
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
 * Detect which element keys are already mapped in aliases.ts by checking RHS usage
 * of aliasesGenerated references.
 *
 * Supported formats:
 *   aliasesGenerated.elementKey
 *   aliasesGenerated["elementKey"]
 *   aliasesGenerated['elementKey']
 *
 * This is what allows humans to rename the LHS alias key without duplicates
 * being re-added.
 */
function extractMappedElementKeysFromAliasesTs(aliasesHumanTs: string): Set<string> {
    const mapped = new Set<string>();
    const cleaned = stripLineComments(aliasesHumanTs);

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

function parseAliasEntryLine(line: string): AliasEntry {
    const trimmed = line.trim();

    if (!trimmed) {
        return { rawLine: line, aliasKey: null, generatedKey: null };
    }

    const aliasMatch = trimmed.match(/^(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][A-Za-z0-9_$]*))\s*:/);
    const aliasKey = aliasMatch
        ? (aliasMatch[1] ?? aliasMatch[2] ?? aliasMatch[3] ?? null)
        : null;

    const generatedMatch = trimmed.match(
        /\baliasesGenerated(?:\.([A-Za-z_$][A-Za-z0-9_$]*)|\[(?:"([^"]+)"|'([^']+)')\])/
    );
    const generatedKey = generatedMatch
        ? (generatedMatch[1] ?? generatedMatch[2] ?? generatedMatch[3] ?? null)
        : null;

    return {
        rawLine: line,
        aliasKey,
        generatedKey,
    };
}

function removeStaleAliases(params: {
    aliasesHumanPath: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: SyncLog;
}): boolean {
    const { aliasesHumanPath, pageMap, verbose, log } = params;

    if (!fs.existsSync(aliasesHumanPath)) return false;

    const txt = fs.readFileSync(aliasesHumanPath, "utf8");
    const obj = extractAliasesObjectBody(txt);
    if (!obj) {
        log.info(`WARN: Could not parse aliases.ts to remove stale keys: ${aliasesHumanPath}`);
        return false;
    }

    const validGeneratedKeys = new Set(Object.keys(pageMap.elements));
    const lines = obj.body.split("\n");

    let removedCount = 0;
    const keptLines: string[] = [];

    for (const line of lines) {
        const parsed = parseAliasEntryLine(line);

        // Keep blank lines / comments / anything that is not a direct aliasesGenerated mapping
        if (!parsed.generatedKey) {
            keptLines.push(line);
            continue;
        }

        // Remove only mappings whose RHS generated key no longer exists
        if (!validGeneratedKeys.has(parsed.generatedKey)) {
            removedCount++;
            if (verbose) {
                log.debug?.(
                    `Removing stale alias mapping: ${parsed.aliasKey ?? "<unknown>"} -> ${parsed.generatedKey}`
                );
            }
            continue;
        }

        keptLines.push(line);
    }

    if (removedCount === 0) {
        return false;
    }

    const newBody = keptLines.join("\n");
    const updated = txt.slice(0, obj.bodyStartIndex) + newBody + txt.slice(obj.bodyEndIndex);

    fs.writeFileSync(aliasesHumanPath, updated, "utf8");
    log.info(`Updated aliases.ts (removed ${removedCount} stale mapping(s)): ${aliasesHumanPath}`);
    return true;
}

function appendNewAliases(params: {
    aliasesHumanPath: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: SyncLog;
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

export function syncAliasesHumanFile(params: {
    aliasesHumanPath: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: SyncLog;
}) {
    const { aliasesHumanPath, pageMap, verbose, log } = params;

    removeStaleAliases({ aliasesHumanPath, pageMap, verbose, log });
    appendNewAliases({ aliasesHumanPath, pageMap, verbose, log });
}