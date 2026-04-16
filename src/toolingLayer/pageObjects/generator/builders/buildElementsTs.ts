// src/toolingLayer/pageObjects/generator/builders/buildElementsTs.ts

import { escapeTsString, isValidTsIdentifier } from "@utils/ts";
import type { PageMap, PageMapElement } from "../generator/types";
import {
    getPageObjectFileParts,
    headerFilePath,
} from "../utils/buildGeneratedHeader";

type ElementEntry = {
    key: string;
    value: PageMapElement;
};

function prop(key: string): string {
    return isValidTsIdentifier(key) ? key : JSON.stringify(key);
}

function renderEntry(entry: ElementEntry): string[] {
    const { key, value } = entry;
    const fallbacks = Array.isArray(value.fallbacks) ? value.fallbacks : [];
    const items = fallbacks.map((item) => `"${escapeTsString(item)}"`).join(", ");
    const lines: string[] = [
        `  ${prop(key)}: {`,
        `    type: "${escapeTsString(value.type)}",`,
        `    preferred: "${escapeTsString(value.preferred)}",`,
        `    fallbacks: [${items}],`,
    ];

    if (value.stableKey) {
        lines.push(`    stableKey: "${escapeTsString(value.stableKey)}",`);
    }

    lines.push(`  },`);
    return lines;
}

export function buildElementsTs(pageMap: PageMap): string {
    const entries = Object.entries(pageMap.elements).map(([key, value]) => ({
        key,
        value,
    }));

    const lines: string[] = [
        headerFilePath(getPageObjectFileParts(pageMap.pageKey, "elements.ts")),
        `// pageKey: ${pageMap.pageKey}`,
        `// scannedAt: ${pageMap.scannedAt ?? new Date().toISOString()}`,
        ``,
        `export type ElementDef = {`,
        `  type: string;`,
        `  preferred: string;`,
        `  fallbacks: readonly string[];`,
        `  stableKey?: string;`,
        `};`,
        ``,
        `export const elements = {`,
    ];

    for (const entry of entries) {
        lines.push(...renderEntry(entry));
    }

    lines.push(`} as const;`);
    lines.push(``);
    lines.push(`export type ElementKey = keyof typeof elements;`);

    return lines.join("\n");
}
