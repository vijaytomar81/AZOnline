// src/pageObjectTools/page-object-generator/generator/registry/generatePageManager.ts

import path from "node:path";

import { safeReadText, safeWriteText } from "@utils/fs";
import { PAGE_OBJECTS_ROOT_DIR } from "@utils/paths";
import { toCamelFromText } from "@utils/text";
import type { PageManifestEntry } from "../pageManifest";
import {
    headerFilePath,
    headerGeneratedFromManifest,
    getPageManagerFileParts,
} from "../../utils/buildGeneratedHeader";

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
    return `import { ${entry.className} } from "${entry.paths.pageObjectImport}";`;
}

function buildEntryLine(entry: PageManifestEntry): string {
    const member = toCamelFromText(lastSegment(entry.pageKey));
    const key = `${entry.product}.${member}`;

    return `            ${member}: this.get("${key}", () => new ${entry.className}(this.page)),`;
}

function groupEntriesByProduct(entries: PageManifestEntry[]): Map<string, PageManifestEntry[]> {
    const byProduct = new Map<string, PageManifestEntry[]>();

    for (const entry of entries) {
        const current = byProduct.get(entry.product) ?? [];
        current.push(entry);
        byProduct.set(entry.product, current);
    }

    for (const [, group] of byProduct) {
        group.sort((a, b) => a.pageKey.localeCompare(b.pageKey));
    }

    return byProduct;
}

export function generatePageManagerFromEntries(
    entries: PageManifestEntry[],
    pagesDir = PAGE_OBJECTS_ROOT_DIR
): GeneratePageManagerResult {
    const file = path.join(pagesDir, "pageManager.ts");
    const sortedEntries = [...entries].sort((a, b) => a.pageKey.localeCompare(b.pageKey));
    const importLines = sortedEntries.map(buildImportLine);
    const byProduct = groupEntriesByProduct(sortedEntries);

    const lines: string[] = [];
    lines.push(headerFilePath(getPageManagerFileParts()));
    lines.push(headerGeneratedFromManifest());
    
    lines.push(``);
    lines.push(`import type { Page } from "@playwright/test";`);
    lines.push(...importLines);

    if (importLines.length > 0) lines.push(``);

    lines.push(`type PageFactory<T> = () => T;`);
    lines.push(``);
    lines.push(`export class PageManager {`);
    lines.push(`    private readonly cache = new Map<string, unknown>();`);
    lines.push(``);
    lines.push(`    constructor(private readonly page: Page) {}`);
    lines.push(``);
    lines.push(`    private get<T>(key: string, factory: PageFactory<T>): T {`);
    lines.push(`        const existing = this.cache.get(key) as T | undefined;`);
    lines.push(``);
    lines.push(`        if (existing) {`);
    lines.push(`            return existing;`);
    lines.push(`        }`);
    lines.push(``);
    lines.push(`        const created = factory();`);
    lines.push(`        this.cache.set(key, created);`);
    lines.push(`        return created;`);
    lines.push(`    }`);
    lines.push(``);

    for (const [product, productEntries] of [...byProduct.entries()].sort(([a], [b]) => a.localeCompare(b))) {
        lines.push(`    get ${product}() {`);
        lines.push(`        return {`);

        for (const entry of productEntries) {
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
        return { changed: false, addedImports: [], addedEntries: [] };
    }

    safeWriteText(file, nextText);

    return {
        changed: true,
        addedImports: importLines,
        addedEntries: sortedEntries.map(buildEntryLine),
    };
}
