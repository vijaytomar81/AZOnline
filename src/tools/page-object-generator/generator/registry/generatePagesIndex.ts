// src/tools/page-object-generator/generator/registry/generatePagesIndex.ts
import path from "node:path";

import { safeReadText, safeWriteText } from "@/utils/fs";
import { PAGES_DIR } from "@/utils/paths";
import type { PageObjectsManifest } from "../pageManifest";

export type GeneratePagesIndexResult = {
    changed: boolean;
    added: string[];
};

function ensureTrailingNewline(text: string): string {
    return text.endsWith("\n") ? text : `${text}\n`;
}

export function generatePagesIndexFromManifest(
    manifest: PageObjectsManifest,
    pagesDir = PAGES_DIR
): GeneratePagesIndexResult {
    const indexFile = path.join(pagesDir, "index.ts");

    const exportLines = Object.values(manifest.pages)
        .sort((a, b) => a.pageKey.localeCompare(b.pageKey))
        .map((entry) => `export * from "${entry.pageObjectImportPath}";`);

    const lines: string[] = [];
    lines.push(`// src/pages/index.ts`);
    lines.push(`// AUTO-GENERATED from src/pages/.manifest/page-objects.manifest.json`);
    lines.push(``);

    if (exportLines.length > 0) {
        lines.push(...exportLines);
        lines.push(``);
    }

    const nextText = ensureTrailingNewline(lines.join("\n"));
    const prevText = safeReadText(indexFile);

    if (prevText === nextText) {
        return {
            changed: false,
            added: [],
        };
    }

    safeWriteText(indexFile, nextText);

    return {
        changed: true,
        added: exportLines,
    };
}