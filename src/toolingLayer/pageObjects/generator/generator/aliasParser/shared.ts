// src/toolingLayer/pageObjects/generator/generator/aliasParser/shared.ts
import { isValidTsIdentifier } from "@utils/ts";
import { stripLineComments } from "@utils/text";
import type { AliasEntry, AliasPair, AliasesObjectBody } from "./types";

export function toPropertyAccess(objectName: string, key: string): string {
    return isValidTsIdentifier(key)
        ? `${objectName}.${key}`
        : `${objectName}[${JSON.stringify(key)}]`;
}

export function extractAliasesObjectBody(
    aliasesTs: string
): AliasesObjectBody | null {
    const cleaned = stripLineComments(aliasesTs);

    const re =
        /export\s+const\s+aliases\s*=\s*\{([\s\S]*?)\}\s*(?:as\s+const\s+satisfies\s+Record<string,\s*ElementKey>|as\s+Record<string,\s*ElementKey>|as\s+const\s+satisfies|as\s+Record)\s*;?/m;

    const match = cleaned.match(re);
    if (!match || typeof match.index !== "number") return null;

    const fullMatch = match[0];
    const body = match[1] ?? "";

    const relBodyStart = fullMatch.indexOf(body);
    const relBodyEnd = relBodyStart + body.length;

    return {
        body,
        bodyStartIndex: match.index + relBodyStart,
        bodyEndIndex: match.index + relBodyEnd,
    };
}

export function extractAliasPairsFromAliasesTs(aliasesTs: string): AliasPair[] {
    const obj = extractAliasesObjectBody(aliasesTs);
    if (!obj) return [];

    const re =
        /^\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*aliasesGenerated\.([A-Za-z_$][A-Za-z0-9_$]*)\s*,\s*$/gm;

    const pairs: AliasPair[] = [];
    let match: RegExpExecArray | null;

    while ((match = re.exec(obj.body))) {
        pairs.push({
            aliasKey: match[1]!,
            elementKey: match[2]!,
        });
    }

    return pairs;
}

export function extractAliasKeysFromAliasesTs(aliasesTs: string): Set<string> {
    const aliasKeys = new Set<string>();
    const obj = extractAliasesObjectBody(aliasesTs);
    if (!obj) return aliasKeys;

    const body = stripLineComments(obj.body);

    const re = /(?:^|\n)\s*(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][A-Za-z0-9_$]*))\s*:/g;

    let match: RegExpExecArray | null;
    while ((match = re.exec(body))) {
        const key = match[1] ?? match[2] ?? match[3];
        if (key) aliasKeys.add(key);
    }

    return aliasKeys;
}

export function extractMappedElementKeysFromAliasesTs(aliasesTs: string): Set<string> {
    const mapped = new Set<string>();
    const cleaned = stripLineComments(aliasesTs);

    const re =
        /\baliasesGenerated(?:\.([A-Za-z_$][A-Za-z0-9_$]*)|\[(?:"([^"]+)"|'([^']+)')\])/g;

    let match: RegExpExecArray | null;
    while ((match = re.exec(cleaned))) {
        const key = match[1] ?? match[2] ?? match[3];
        if (key) mapped.add(key);
    }

    return mapped;
}

export function parseAliasEntryLine(line: string): AliasEntry {
    const trimmed = line.trim();

    if (!trimmed) {
        return { rawLine: line, aliasKey: null, generatedKey: null };
    }

    const aliasMatch = trimmed.match(
        /^(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][A-Za-z0-9_$]*))\s*:/
    );

    const generatedMatch = trimmed.match(
        /\baliasesGenerated(?:\.([A-Za-z_$][A-Za-z0-9_$]*)|\[(?:"([^"]+)"|'([^']+)')\])/
    );

    return {
        rawLine: line,
        aliasKey: aliasMatch
            ? (aliasMatch[1] ?? aliasMatch[2] ?? aliasMatch[3] ?? null)
            : null,
        generatedKey: generatedMatch
            ? (generatedMatch[1] ?? generatedMatch[2] ?? generatedMatch[3] ?? null)
            : null,
    };
}