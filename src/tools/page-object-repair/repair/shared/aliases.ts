// src/tools/page-object-repair/repair/shared/aliases.ts

import fs from "node:fs";

import { isValidTsIdentifier } from "@utils/ts";
import { toRepoRelative } from "@utils/paths";
import {
    extractExportedObjectBody,
    splitTopLevelObjectEntries,
} from "@/tools/page-object-common/tsObjectParser";
import { extractExportedObjectKeys } from "@/tools/page-object-common/extractTsObjectKeys";

export type AliasPair = {
    aliasKey: string;
    generatedKey: string;
};

function prop(key: string): string {
    return isValidTsIdentifier(key) ? key : JSON.stringify(key);
}

function generatedRef(key: string): string {
    return isValidTsIdentifier(key)
        ? `aliasesGenerated.${key}`
        : `aliasesGenerated[${JSON.stringify(key)}]`;
}

function keyFromEntry(entry: string): string | undefined {
    const match = entry.match(/^(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][A-Za-z0-9_$]*))\s*:/);
    return match?.[1] ?? match?.[2] ?? match?.[3] ?? undefined;
}

function rhsGeneratedKey(entry: string): string | undefined {
    const match = entry.match(
        /\baliasesGenerated(?:\.([A-Za-z_$][A-Za-z0-9_$]*)|\[(?:"([^"]+)"|'([^']+)')\])/
    );
    return match?.[1] ?? match?.[2] ?? match?.[3] ?? undefined;
}

export function readGeneratedKeys(filePath: string): string[] {
    if (!fs.existsSync(filePath)) return [];
    return [...extractExportedObjectKeys(fs.readFileSync(filePath, "utf8"), "aliasesGenerated")].sort((a, b) =>
        a.localeCompare(b)
    );
}

export function readAliasPairs(filePath: string): AliasPair[] {
    if (!fs.existsSync(filePath)) return [];

    const body = extractExportedObjectBody(fs.readFileSync(filePath, "utf8"), "aliases");
    if (!body) return [];

    return splitTopLevelObjectEntries(body)
        .map((entry) => {
            const aliasKey = keyFromEntry(entry);
            const generatedKey = rhsGeneratedKey(entry);

            if (!aliasKey || !generatedKey) return null;
            return { aliasKey, generatedKey };
        })
        .filter((x): x is AliasPair => Boolean(x));
}

export function buildRepairedAliasPairs(
    existingPairs: AliasPair[],
    generatedKeys: string[]
): { updatedPairs: AliasPair[]; removedPairs: AliasPair[]; addedPairs: AliasPair[] } {
    const generatedKeySet = new Set(generatedKeys);

    const validExistingPairs = existingPairs.filter((pair) => generatedKeySet.has(pair.generatedKey));
    const removedPairs = existingPairs.filter((pair) => !generatedKeySet.has(pair.generatedKey));

    const coveredGeneratedKeys = new Set(validExistingPairs.map((pair) => pair.generatedKey));
    const missingGeneratedKeys = generatedKeys.filter((key) => !coveredGeneratedKeys.has(key));

    const addedPairs = missingGeneratedKeys.map((key) => ({
        aliasKey: key,
        generatedKey: key,
    }));

    return {
        updatedPairs: [...validExistingPairs, ...addedPairs],
        removedPairs,
        addedPairs,
    };
}

export function aliasPairText(pair: AliasPair): string {
    return `${pair.aliasKey} -> ${pair.generatedKey}`;
}

export function writeAliasesHumanFile(filePath: string, pageKey: string, pairs: AliasPair[]): void {
    const lines: string[] = [];

    lines.push(`// ${toRepoRelative(filePath)}`);
    lines.push(`// REPAIRED FILE`);
    lines.push(`// pageKey: ${pageKey}`);
    lines.push(``);
    lines.push(`import type { ElementKey } from "./elements";`);
    lines.push(`import { aliasesGenerated } from "./aliases.generated";`);
    lines.push(``);
    lines.push(`export const aliases = {`);

    for (const pair of pairs) {
        lines.push(`  ${prop(pair.aliasKey)}: ${generatedRef(pair.generatedKey)},`);
    }

    lines.push(`} as const satisfies Record<string, ElementKey>;`);
    lines.push(``);
    lines.push(`export type AliasKey = keyof typeof aliases;`);
    lines.push(`export const allAliases = { ...aliasesGenerated, ...aliases } as const;`);
    lines.push(`export type AnyAliasKey = keyof typeof allAliases;`);
    lines.push(``);

    fs.writeFileSync(filePath, lines.join("\n"), "utf8");
}