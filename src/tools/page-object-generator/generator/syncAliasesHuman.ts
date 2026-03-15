// src/tools/page-object-generator/generator/syncAliasesHuman.ts

import fs from "node:fs";

import type { Logger } from "@/utils/logger";
import type { PageMap } from "./types";
import { isValidTsIdentifier } from "@/utils/ts";
import {
    extractAliasKeysFromAliasesTs,
    extractAliasesObjectBody,
    extractMappedElementKeysFromAliasesTs,
    parseAliasEntryLine,
    toPropertyAccess,
} from "./aliasParser/shared";

function removeStaleAliases(params: {
    aliasesHumanPath: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: Logger;
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
                log.debug(
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
    const updated =
        txt.slice(0, obj.bodyStartIndex) +
        newBody +
        txt.slice(obj.bodyEndIndex);

    fs.writeFileSync(aliasesHumanPath, updated, "utf8");
    log.info(`Updated aliases.ts (removed ${removedCount} stale mapping(s)): ${aliasesHumanPath}`);

    return true;
}

function appendNewAliases(params: {
    aliasesHumanPath: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: Logger;
}) {
    const { aliasesHumanPath, pageMap, verbose, log } = params;

    if (!fs.existsSync(aliasesHumanPath)) return;

    const txt = fs.readFileSync(aliasesHumanPath, "utf8");
    const mapped = extractMappedElementKeysFromAliasesTs(txt);
    const existingAliasKeys = extractAliasKeysFromAliasesTs(txt);

    const elementKeys = Object.keys(pageMap.elements).sort((a, b) => a.localeCompare(b));
    const missing = elementKeys.filter(
        (key) => !mapped.has(key) && !existingAliasKeys.has(key)
    );

    if (missing.length === 0) {
        if (verbose) {
            log.debug(`aliases.ts up-to-date: ${aliasesHumanPath}`);
        }
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

    for (const key of missing) {
        const prop = isValidTsIdentifier(key) ? key : JSON.stringify(key);
        const rhs = toPropertyAccess("aliasesGenerated", key);
        lines.push(`  ${prop}: ${rhs},`);
    }

    const updated =
        txt.slice(0, insertAt) +
        lines.join("\n") +
        txt.slice(insertAt);

    fs.writeFileSync(aliasesHumanPath, updated, "utf8");
    log.info(`Updated aliases.ts (appended ${missing.length} new mapping(s)): ${aliasesHumanPath}`);
}

export function syncAliasesHumanFile(params: {
    aliasesHumanPath: string;
    pageMap: PageMap;
    verbose?: boolean;
    log: Logger;
}) {
    const { aliasesHumanPath, pageMap, verbose, log } = params;

    removeStaleAliases({ aliasesHumanPath, pageMap, verbose, log });
    appendNewAliases({ aliasesHumanPath, pageMap, verbose, log });
}