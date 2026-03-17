// src/tools/page-object-generator/generator/registry/generatePagesIndex.ts

import path from "node:path";

import { safeReadText, safeWriteText } from "@/utils/fs";
import { PAGES_DIR } from "@/utils/paths";
import type { PageManifestEntry } from "../pageManifest";

export type GeneratePagesIndexResult = {
    changed: boolean;
    added: string[];
};

function ensureTrailingNewline(text: string): string {
    return text.endsWith("\n") ? text : `${text}\n`;
}

export function generatePagesIndexFromEntries(
    entries: PageManifestEntry[],
    pagesDir = PAGES_DIR
): GeneratePagesIndexResult {
    const indexFile = path.join(pagesDir, "index.ts");

    const exportLines = [
        `export * from "./pageManager";`,
        ...[...entries]
            .sort((a, b) => a.pageKey.localeCompare(b.pageKey))
            .map((entry) => `export * from "${entry.pageObjectImportPath}";`),
    ];

    const lines: string[] = [];
    lines.push(`// src/pages/index.ts`);
    lines.push(`// AUTO-GENERATED from src/pages/.manifest/`);
    lines.push(``);
    lines.push(...exportLines);
    lines.push(``);

    const nextText = ensureTrailingNewline(lines.join("\n"));
    const prevText = safeReadText(indexFile);

    if (prevText === nextText) {
        return { changed: false, added: [] };
    }

    safeWriteText(indexFile, nextText);

    return {
        changed: true,
        added: exportLines,
    };
}