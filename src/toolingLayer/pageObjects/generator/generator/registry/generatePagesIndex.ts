// src/toolingLayer/pageObjects/generator/generator/registry/generatePagesIndex.ts

import path from "node:path";

import { safeReadText, safeWriteText } from "@utils/fs";
import { PAGE_OBJECTS_ROOT_DIR } from "@utils/paths";
import type { PageManifestEntry } from "../pageManifest";
import {
    headerFilePath,
    headerGeneratedFromManifest,
    getIndexFileParts,
} from "../../utils/buildGeneratedHeader";

export type GeneratePagesIndexResult = {
    changed: boolean;
    added: string[];
};

function ensureTrailingNewline(text: string): string {
    return text.endsWith("\n") ? text : `${text}\n`;
}

function extractExportLines(text: string | null): string[] {
    if (!text) return [];
    return text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith('export * from "') || line.startsWith('export { PageManager }'));
}

export function generatePagesIndexFromEntries(
    entries: PageManifestEntry[],
    pagesDir = PAGE_OBJECTS_ROOT_DIR
): GeneratePagesIndexResult {
    const indexFile = path.join(pagesDir, "index.ts");

    const exportLines = [
        `export * from "./pageManager";`,
        ...[...entries]
            .sort((a, b) => a.pageKey.localeCompare(b.pageKey))
            .map((entry) => `export * from "${entry.paths.pageObjectImport}";`),
    ];

    const lines: string[] = [];
    lines.push(headerFilePath(getIndexFileParts()));
    lines.push(headerGeneratedFromManifest());
    lines.push(``);
    lines.push(...exportLines);
    lines.push(``);

    const nextText = ensureTrailingNewline(lines.join("\n"));
    const prevText = safeReadText(indexFile);

    if (prevText === nextText) {
        return { changed: false, added: [] };
    }

    const previousExports = new Set(extractExportLines(prevText));
    const added = exportLines.filter((line) => !previousExports.has(line));

    safeWriteText(indexFile, nextText);

    return {
        changed: true,
        added,
    };
}
