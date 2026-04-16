// src/toolingLayer/pageObjects/generator/builders/buildAliasesHumanTs.ts

import { isValidTsIdentifier } from "@utils/ts";
import type { PageMap } from "../generator/types";
import {
    getPageObjectFileParts,
    headerFilePath,
} from "../utils/buildGeneratedHeader";

function toPropertyAccess(objectName: string, key: string): string {
    return isValidTsIdentifier(key)
        ? `${objectName}.${key}`
        : `${objectName}[${JSON.stringify(key)}]`;
}

export function buildAliasesHumanTs(pageMap: PageMap): string {
    const keys = Object.keys(pageMap.elements).sort((a, b) => a.localeCompare(b));

    const lines: string[] = [
        headerFilePath(getPageObjectFileParts(pageMap.pageKey, "aliases.ts")),
        `// pageKey: ${pageMap.pageKey}`,
        `//`,
        `// This file is safe to edit.`,
        `//`,
        `// Generator behavior:`,
        `// - On first creation, it adds a 1:1 alias for each element.`,
        `// - On later runs, it only appends aliases for new element keys.`,
        `// - Existing aliases are never rewritten or removed.`,
        `// - The generator detects existing mappings by scanning RHS aliasesGenerated references.`,
        ``,
        `import type { ElementKey } from "./elements";`,
        `import { aliasesGenerated } from "./aliases.generated";`,
        ``,
        `// Business-friendly aliases (edit freely)`,
        `export const aliases = {`,
    ];

    for (const key of keys) {
        const prop = isValidTsIdentifier(key) ? key : JSON.stringify(key);
        const rhs = toPropertyAccess("aliasesGenerated", key);
        lines.push(`  ${prop}: ${rhs},`);
    }

    lines.push(`} as const satisfies Record<string, ElementKey>;`);
    lines.push(``);
    lines.push(`export const aliasKeys = {`);

    for (const key of keys) {
        const prop = isValidTsIdentifier(key) ? key : JSON.stringify(key);
        lines.push(`  ${prop}: ${JSON.stringify(key)},`);
    }

    lines.push(
        `} as const satisfies Record<keyof typeof aliases, keyof typeof aliases>;`
    );
    lines.push(``);
    lines.push(`export type AliasKey = keyof typeof aliases;`);
    lines.push(``);
    lines.push(`export const allAliases = { ...aliasesGenerated, ...aliases } as const;`);
    lines.push(`export type AnyAliasKey = keyof typeof allAliases;`);

    return lines.join("\n");
}
