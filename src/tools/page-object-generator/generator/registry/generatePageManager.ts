// src/tools/page-object-generator/generator/registry/generatePageManager.ts
import path from "node:path";

import { safeReadText, safeWriteText } from "@/utils/fs";
import { PAGES_DIR } from "@/utils/paths";
import { toCamelFromText } from "@/utils/text";
import type { PageManifestEntry, PageObjectsManifest } from "../pageManifest";

export type GeneratePageManagerResult = {
    changed: boolean;
    addedImports: string[];
    addedEntries: string[];
};

function ensureTrailingNewline(text: string): string {
    return text.endsWith("\n") ? text : `${text}\n`;
}

function lastSegment(pageKey: string): string {
    return pageKey.split(".").slice(-1)[0] || "page";
}

function buildImportLine(entry: PageManifestEntry): string {
    return `import { ${entry.className} } from "${entry.pageObjectImportPath}";`;
}

function buildEntryLine(entry: PageManifestEntry): string {
    const member = toCamelFromText(lastSegment(entry.pageKey));
    const key = `${entry.product}.${member}`;

    return `            ${member}: this.get("${key}", () => new ${entry.className}(this.page)),`;
}

function groupEntriesByProduct(
    manifest: PageObjectsManifest
): Map<string, PageManifestEntry[]> {
    const byProduct = new Map<string, PageManifestEntry[]>();

    for (const entry of Object.values(manifest.pages)) {
        const groupEntries = byProduct.get(entry.product) ?? [];
        groupEntries.push(entry);
        byProduct.set(entry.product, groupEntries);
    }

    for (const [, entries] of byProduct) {
        entries.sort((a, b) => a.pageKey.localeCompare(b.pageKey));
    }

    return byProduct;
}

export function generatePageManagerFromManifest(
    manifest: PageObjectsManifest,
    pagesDir = PAGES_DIR
): GeneratePageManagerResult {
    const file = path.join(pagesDir, "pageManager.ts");

    const sortedEntries = Object.values(manifest.pages).sort((a, b) =>
        a.pageKey.localeCompare(b.pageKey)
    );

    const importLines = sortedEntries.map(buildImportLine);
    const byProduct = groupEntriesByProduct(manifest);

    const lines: string[] = [];
    lines.push(`// src/pages/pageManager.ts`);
    lines.push(`// AUTO-GENERATED from src/pages/.manifest/page-objects.manifest.json`);
    lines.push(``);
    lines.push(`import type { Page } from "@playwright/test";`);
    lines.push(...importLines);

    if (importLines.length > 0) {
        lines.push(``);
    }

    lines.push(`type PageFactory<T> = () => T;`);
    lines.push(``);
    lines.push(`export class PageManager {`);
    lines.push(`    constructor(private readonly page: Page) {}`);
    lines.push(``);
    lines.push(`    private get<T>(_key: string, factory: PageFactory<T>): T {`);
    lines.push(`        return factory();`);
    lines.push(`    }`);
    lines.push(``);

    for (const [product, entries] of Array.from(byProduct.entries()).sort(([a], [b]) =>
        a.localeCompare(b)
    )) {
        lines.push(`    get ${product}() {`);
        lines.push(`        return {`);

        for (const entry of entries) {
            lines.push(buildEntryLine(entry));
        }

        lines.push(`        };`);
        lines.push(`    }`);
        lines.push(``);
    }

    lines.push(`}`);

    const nextText = ensureTrailingNewline(lines.join("\n"));
    const prevText = safeReadText(file);

    if (prevText === nextText) {
        return {
            changed: false,
            addedImports: [],
            addedEntries: [],
        };
    }

    safeWriteText(file, nextText);

    return {
        changed: true,
        addedImports: importLines,
        addedEntries: sortedEntries.map(buildEntryLine),
    };
}