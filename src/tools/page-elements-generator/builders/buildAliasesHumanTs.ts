// src/scanner/elements-generator/builders/buildAliasesHumanTs.ts

import type { PageMap } from "../generator/types";

function isValidTsIdentifier(key: string) {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}

export function buildAliasesHumanTs(pageMap: PageMap): string {
    const lines: string[] = [];

    const keys = Object.keys(pageMap.elements).sort((a, b) => a.localeCompare(b));

    lines.push(`// HUMAN-MAINTAINED FILE`);
    lines.push(`// pageKey: ${pageMap.pageKey}`);
    lines.push(`//`);
    lines.push(`// This file is safe to edit.`);
    lines.push(`// Generator behavior:`);
    lines.push(`// - On first creation, it adds a 1:1 alias for each element (alias == element key).`);
    lines.push(`// - On later runs, it ONLY appends aliases for NEW element keys.`);
    lines.push(`// - It detects "already mapped" by RHS usage: aliasesGenerated.<elementKey>`);
    lines.push(`//   so you can rename the alias key on the left and it won't re-add duplicates.`);
    lines.push(``);
    lines.push(`import type { ElementKey } from "./elements";`);
    lines.push(`import { aliasesGenerated } from "./aliases.generated";`);
    lines.push(``);
    lines.push(`// Business-friendly aliases (edit freely)`);
    lines.push(`// NOTE: AliasKey is derived ONLY from this object, so renaming LHS is fully supported.`);
    lines.push(`export const aliases = {`);

    for (const k of keys) {
        const prop = isValidTsIdentifier(k) ? k : JSON.stringify(k);
        lines.push(`  ${prop}: aliasesGenerated.${k},`);
    }

    lines.push(`} as const satisfies Record<string, ElementKey>;`);
    lines.push(``);
    lines.push(`// Primary type used by Page Objects (business alias keys)`);
    lines.push(`export type AliasKey = keyof typeof aliases;`);
    lines.push(``);
    lines.push(`// Optional: includes generated element keys too (useful for debugging/tools)`);
    lines.push(`export const allAliases = { ...aliasesGenerated, ...aliases } as const;`);
    lines.push(`export type AnyAliasKey = keyof typeof allAliases;`);

    return lines.join("\n");
}