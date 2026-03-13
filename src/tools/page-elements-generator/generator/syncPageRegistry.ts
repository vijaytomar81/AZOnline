// src/tools/page-elements-generator/generator/syncPageRegistry.ts

import path from "node:path";

import { safeReadText, safeWriteText } from "@/utils/fs";
import { PAGES_DIR } from "@/utils/paths";
import { toCamelFromText } from "@/utils/text";

export type PageRegistryEntry = {
    pageKey: string;   // e.g. "motor.car-details"
    className: string; // e.g. "CarDetailsPage"
};

export type SyncPagesIndexResult = {
    changed: boolean;
    added: string[];
};

export type SyncPageManagerResult = {
    changed: boolean;
    addedImports: string[];
    addedEntries: string[];
};

export type SyncPageRegistryResult = {
    index: SyncPagesIndexResult;
    pageManager: SyncPageManagerResult;
};

function normalizeLines(text: string): string[] {
    return text.replace(/\r\n/g, "\n").split("\n");
}

function ensureTrailingNewline(text: string): string {
    return text.endsWith("\n") ? text : `${text}\n`;
}

function uniqueSorted<T>(items: T[], keyFn: (item: T) => string): T[] {
    const map = new Map<string, T>();

    for (const item of items) {
        map.set(keyFn(item), item);
    }

    return Array.from(map.values()).sort((a, b) =>
        keyFn(a).localeCompare(keyFn(b))
    );
}

function pageKeyToFolderPath(pageKey: string): string {
    return pageKey.split(".").join("/");
}

function topLevelGroup(pageKey: string): string {
    return pageKey.split(".")[0] || "common";
}

function lastSegment(pageKey: string): string {
    return pageKey.split(".").slice(-1)[0] || "page";
}

function buildIndexExportLine(entry: PageRegistryEntry): string {
    return `export * from "@page-objects/${pageKeyToFolderPath(entry.pageKey)}/${entry.className}";`;
}

function buildPageImportLine(entry: PageRegistryEntry): string {
    return `import { ${entry.className} } from "@page-objects/${pageKeyToFolderPath(entry.pageKey)}/${entry.className}";`;
}

function buildPageManagerEntryLine(entry: PageRegistryEntry): string {
    const group = topLevelGroup(entry.pageKey);
    const member = toCamelFromText(lastSegment(entry.pageKey));

    return `            ${member}: this.get("${group}.${member}", () => new ${entry.className}(this.page)),`;
}

export function syncPagesIndex(entries: PageRegistryEntry[], pagesDir = PAGES_DIR): SyncPagesIndexResult {
    const indexFile = path.join(pagesDir, "index.ts");

    const raw =
        safeReadText(indexFile) ??
        `// src/pages/index.ts\n`;

    const lines = normalizeLines(raw);

    const existing = new Set(
        lines
            .map((l) => l.trim())
            .filter((l) => l.startsWith("export * from "))
    );

    const missing = uniqueSorted(
        entries
            .map(buildIndexExportLine)
            .filter((line) => !existing.has(line)),
        (x) => x
    );

    if (missing.length === 0) {
        return { changed: false, added: [] };
    }

    const nextLines = [...lines];

    if (nextLines.length > 0 && nextLines[nextLines.length - 1].trim() !== "") {
        nextLines.push("");
    }

    nextLines.push(...missing);

    const nextText = ensureTrailingNewline(nextLines.join("\n"));
    safeWriteText(indexFile, nextText);

    return { changed: true, added: missing };
}

function insertMissingImports(lines: string[], missingImports: string[]) {
    if (missingImports.length === 0) return lines;

    const next = [...lines];

    let insertAt = -1;

    for (let i = 0; i < next.length; i++) {
        if (next[i].startsWith("import ")) {
            insertAt = i + 1;
        }
    }

    if (insertAt === -1) insertAt = 0;

    next.splice(insertAt, 0, ...missingImports);

    return next;
}

function findGroupGetterStart(lines: string[], group: string): number {
    return lines.findIndex((line) => line.includes(`get ${group}()`));
}

function findReturnObjectStart(lines: string[], getterStart: number): number {
    for (let i = getterStart; i < lines.length; i++) {
        if (lines[i].includes("return {")) return i;
    }
    return -1;
}

function findReturnObjectEnd(lines: string[], returnStart: number): number {
    for (let i = returnStart + 1; i < lines.length; i++) {
        if (lines[i].trim() === "};") return i;
    }
    return -1;
}

function findClassEnd(lines: string[]): number {
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim() === "}") return i;
    }
    return lines.length;
}

function buildGroupBlock(group: string, entryLines: string[]): string[] {
    return [
        `    get ${group}() {`,
        `        return {`,
        ...entryLines,
        `        };`,
        `    }`,
    ];
}

export function syncPageManager(entries: PageRegistryEntry[], pagesDir = PAGES_DIR): SyncPageManagerResult {
    const file = path.join(pagesDir, "pageManager.ts");

    const raw = safeReadText(file);
    if (!raw) {
        throw new Error(`pageManager.ts not found: ${file}`);
    }

    let lines = normalizeLines(raw);
    let changed = false;
    const addedImports: string[] = [];
    const addedEntries: string[] = [];

    const existingImports = new Set(
        lines
            .map((l) => l.trim())
            .filter((l) => l.startsWith("import { "))
    );

    const wantedImports = uniqueSorted(
        entries.map(buildPageImportLine),
        (x) => x
    );

    const missingImports = wantedImports.filter((line) => !existingImports.has(line));

    if (missingImports.length > 0) {
        lines = insertMissingImports(lines, missingImports);
        addedImports.push(...missingImports);
        changed = true;
    }

    const byGroup = new Map<string, PageRegistryEntry[]>();

    for (const entry of entries) {
        const group = topLevelGroup(entry.pageKey);
        const existing = byGroup.get(group) ?? [];
        existing.push(entry);
        byGroup.set(group, existing);
    }

    for (const [group, rawEntries] of byGroup.entries()) {
        const groupEntries = uniqueSorted(rawEntries, (e) => buildPageManagerEntryLine(e));
        const wantedEntryLines = groupEntries.map(buildPageManagerEntryLine);

        const getterStart = findGroupGetterStart(lines, group);

        if (getterStart >= 0) {
            const returnStart = findReturnObjectStart(lines, getterStart);
            const returnEnd = findReturnObjectEnd(lines, returnStart);

            if (returnStart < 0 || returnEnd < 0) {
                throw new Error(`Unable to parse PageManager group: ${group}`);
            }

            const existingEntryLines = new Set(
                lines
                    .slice(returnStart + 1, returnEnd)
                    .map((l) => l.trim())
                    .filter(Boolean)
            );

            const missingEntryLines = wantedEntryLines.filter(
                (line) => !existingEntryLines.has(line.trim())
            );

            if (missingEntryLines.length > 0) {
                lines.splice(returnEnd, 0, ...missingEntryLines);
                addedEntries.push(...missingEntryLines);
                changed = true;
            }

            continue;
        }

        const classEnd = findClassEnd(lines);
        const newBlock = buildGroupBlock(group, wantedEntryLines);

        const insertLines: string[] = [];

        if (classEnd > 0 && lines[classEnd - 1].trim() !== "") {
            insertLines.push("");
        }

        insertLines.push(...newBlock);

        if (lines[classEnd].trim() === "}") {
            insertLines.push("");
        }

        lines.splice(classEnd, 0, ...insertLines);

        addedEntries.push(...wantedEntryLines);
        changed = true;
    }

    if (!changed) {
        return {
            changed: false,
            addedImports: [],
            addedEntries: [],
        };
    }

    const nextText = ensureTrailingNewline(lines.join("\n"));
    safeWriteText(file, nextText);

    return {
        changed: true,
        addedImports,
        addedEntries,
    };
}

export function syncPageRegistry(entries: PageRegistryEntry[], pagesDir = PAGES_DIR): SyncPageRegistryResult {
    const deduped = uniqueSorted(entries, (e) => `${e.pageKey}::${e.className}`);

    return {
        index: syncPagesIndex(deduped, pagesDir),
        pageManager: syncPageManager(deduped, pagesDir),
    };
}