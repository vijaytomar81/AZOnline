// src/pageObjectTools/page-object-repair/repair/shared/pageManager.ts

import fs from "node:fs";

import { getPageArtifactPaths, getPageManagerFile } from "@/pageObjectTools/page-object-common/pagePaths";
import { loadAllPageMaps } from "@/pageObjectTools/page-object-common/readPageMap";

type PageManagerEntry = {
    pageKey: string;
    product: string;
    member: string;
    className: string;
    importPath: string;
};

function toPascal(input: string): string {
    return input
        .split(/[-_.\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

function toCamel(input: string): string {
    const pascal = toPascal(input);
    return pascal ? pascal.charAt(0).toLowerCase() + pascal.slice(1) : input;
}

export function buildPageManagerEntries(pageObjectsDir: string, mapsDir: string): PageManagerEntry[] {
    return loadAllPageMaps(mapsDir).map((item) => {
        const pageKey = item.pageMap.pageKey;
        const parts = pageKey.split(".");
        const product = parts[0] ?? "unknown";
        const group = parts[1] ?? "common";
        const name = parts.slice(2).join(".");
        const artifact = getPageArtifactPaths(pageObjectsDir, pageKey);

        return {
            pageKey,
            product,
            member: toCamel(parts[parts.length - 1] ?? "page"),
            className: artifact.className,
            importPath: `@page-objects/${product}/${group}/${name}/${artifact.className}`,
        };
    });
}

export function buildPageManagerContent(pageObjectsDir: string, mapsDir: string): string {
    const entries = buildPageManagerEntries(pageObjectsDir, mapsDir).sort((a, b) =>
        a.pageKey.localeCompare(b.pageKey)
    );
    const byProduct = new Map<string, PageManagerEntry[]>();

    for (const entry of entries) {
        const list = byProduct.get(entry.product) ?? [];
        list.push(entry);
        byProduct.set(entry.product, list);
    }

    const lines: string[] = [];
    lines.push(`import type { Page } from "@playwright/test";`);
    for (const entry of entries) {
        lines.push(`import { ${entry.className} } from "${entry.importPath}";`);
    }
    lines.push(``);
    lines.push(`export class PageManager {`);
    lines.push(`  readonly page: Page;`);
    lines.push(`  private cache = new Map<string, unknown>();`);
    lines.push(``);
    lines.push(`  constructor(page: Page) {`);
    lines.push(`    this.page = page;`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  private get<T>(key: string, factory: () => T): T {`);
    lines.push(`    if (!this.cache.has(key)) this.cache.set(key, factory());`);
    lines.push(`    return this.cache.get(key) as T;`);
    lines.push(`  }`);
    lines.push(``);

    for (const [product, productEntries] of [...byProduct.entries()].sort(([a], [b]) => a.localeCompare(b))) {
        lines.push(`  get ${product}() {`);
        lines.push(`    return {`);
        for (const entry of productEntries.sort((a, b) => a.member.localeCompare(b.member))) {
            lines.push(
                `      ${entry.member}: this.get("${entry.product}.${entry.member}", () => new ${entry.className}(this.page)),`
            );
        }
        lines.push(`    };`);
        lines.push(`  }`);
        lines.push(``);
    }

    lines.push(`}`);
    lines.push(``);

    return lines.join("\n");
}

export function readActualPageManagerState(pageRegistryDir: string): { imports: string[]; keys: string[] } {
    const filePath = getPageManagerFile(pageRegistryDir);
    if (!fs.existsSync(filePath)) return { imports: [], keys: [] };

    const tsText = fs.readFileSync(filePath, "utf8");
    const imports = [...tsText.matchAll(/import\s+\{\s*[A-Za-z0-9_]+\s*\}\s+from\s+"([^"]+)";/g)]
        .map((m) => m[1] ?? "")
        .filter((x) => x.startsWith("@page-objects/"))
        .sort((a, b) => a.localeCompare(b));

    const keys = [...tsText.matchAll(/this\.get\("([^"]+)"/g)]
        .map((m) => m[1] ?? "")
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

    return { imports, keys };
}