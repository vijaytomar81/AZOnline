// src/toolingLayer/pageObjects/generator/builders/buildAliasesHumanTs.ts

import type { PageMap } from "../generator/types";
import { isValidTsIdentifier } from "@utils/ts";
import {
    headerFilePath,
    getPageObjectFileParts,
} from "../utils/buildGeneratedHeader";

function toPropertyAccess(objectName: string, key: string): string {
    return isValidTsIdentifier(key)
        ? `${objectName}.${key}`
        : `${objectName}[${JSON.stringify(key)}]`;
}

export function buildAliasesHumanTs(pageMap: PageMap): string {
    const lines: string[] = [];

    const keys = Object.keys(pageMap.elements).sort((a, b) => a.localeCompare(b));

    lines.push(
        headerFilePath(getPageObjectFileParts(pageMap.pageKey, "aliases.ts"))
    );

    lines.push(`// pageKey: ${pageMap.pageKey}`);
    lines.push(`//`);
    lines.push(`// This file is safe to edit.`);
    lines.push(`//`);
    lines.push(`// Generator behavior:`);
    lines.push(`//`);
    lines.push(`// - On first creation, it adds a 1:1 alias for each element`);
    lines.push(`//   (alias key == element key).`);
    lines.push(`//`);
    lines.push(`// - On later runs, it ONLY appends aliases for NEW element keys.`);
    lines.push(`//   Existing aliases are never rewritten or removed.`);
    lines.push(`//`);
    lines.push(`// - The generator detects whether an element is already mapped`);
    lines.push(`//   by scanning RHS usage of aliasesGenerated references.`);
    lines.push(`//`);
    lines.push(`//   Supported formats:`);
    lines.push(`//     aliasesGenerated.elementKey`);
    lines.push(`//     aliasesGenerated["elementKey"]`);
    lines.push(`//`);
    lines.push(`//   Bracket notation is required for keys that are NOT valid`);
    lines.push(`//   TypeScript identifiers (for example numeric keys like "1", "2", etc.).`);
    lines.push(`//`);
    lines.push(`// - Because detection relies on the RHS (aliasesGenerated.*), you are`);
    lines.push(`//   free to rename the alias key on the left-hand side (business alias)`);
    lines.push(`//   without the generator re-adding duplicates.`);
    lines.push(`//`);
    lines.push(`//   Example:`);
    lines.push(`//     driverClaims: aliasesGenerated.additionalDriver1NumberOfClaims`);
    lines.push(`//`);
    lines.push(`//   The generator will recognize the RHS and will NOT re-add`);
    lines.push(`//   additionalDriver1NumberOfClaims again.`);
    lines.push(``);
    lines.push(`import type { ElementKey } from "./elements";`);
    lines.push(`import { aliasesGenerated } from "./aliases.generated";`);
    lines.push(``);
    lines.push(`// Business-friendly aliases (edit freely)`);
    lines.push(`// NOTE: AliasKey is derived ONLY from this object, so renaming LHS is fully supported.`);
    lines.push(`export const aliases = {`);

    for (const k of keys) {
        const prop = isValidTsIdentifier(k) ? k : JSON.stringify(k);
        const rhs = toPropertyAccess("aliasesGenerated", k);
        lines.push(`  ${prop}: ${rhs},`);
    }

    lines.push(`} as const satisfies Record<string, ElementKey>;`);
    lines.push(``);

    // NEW: strongly typed alias keys for generator usage
    lines.push(`export const aliasKeys = {`);

    for (const k of keys) {
        const prop = isValidTsIdentifier(k) ? k : JSON.stringify(k);
        lines.push(`  ${prop}: ${JSON.stringify(k)},`);
    }

    lines.push(`} as const satisfies Record<keyof typeof aliases, keyof typeof aliases>;`);
    lines.push(``);

    // Primary type used by Page Objects (business alias keys)
    lines.push(`export type AliasKey = keyof typeof aliases;`);
    lines.push(``);
    lines.push(`export const allAliases = { ...aliasesGenerated, ...aliases } as const;`);
    lines.push(`export type AnyAliasKey = keyof typeof allAliases;`);

    return lines.join("\n");
}