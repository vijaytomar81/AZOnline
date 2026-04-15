// src/toolingLayer/pageObjects/repair/repair/shared/registry.ts

import fs from "node:fs";

import { toRepoRelative } from "@utils/paths";
import {
    getIndexFile,
    getPageArtifactPaths,
} from "@toolingLayer/pageObjects/common/pagePaths";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";

export function extractIndexExportPaths(tsText: string): string[] {
    return [...tsText.matchAll(/export\s+\*\s+from\s+"([^"]+)";/g)]
        .map((m) => m[1] ?? "")
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
}

export function buildExpectedIndexExports(
    pageObjectsDir: string,
    mapsDir: string
): string[] {
    return loadAllPageMaps(mapsDir)
        .map((item) => {
            const artifact = getPageArtifactPaths(pageObjectsDir, item.pageMap.pageKey);
            const parts = item.pageMap.pageKey.split(".");
            const product = parts[0] ?? "unknown";
            const group = parts[1] ?? "common";
            const name = parts.slice(2).join(".");
            return `@businessLayer/pageObjects/objects/${product}/${group}/${name}/${artifact.className}`;
        })
        .sort((a, b) => a.localeCompare(b));
}

export function buildIndexFileContent(
    pageObjectsDir: string,
    mapsDir: string,
    pageRegistryDir: string
): string {
    const exportPaths = buildExpectedIndexExports(pageObjectsDir, mapsDir);
    const filePath = getIndexFile(pageRegistryDir);
    const lines: string[] = [];

    lines.push(`// ${toRepoRelative(filePath)}`);
    lines.push(`// AUTO-GENERATED from src/pageObjects/.manifest/`);
    lines.push(``);
    lines.push(`export { PageManager } from "./pageManager";`);
    lines.push(``);
    lines.push(`// Export individual pages too (optional, but useful sometimes)`);
    lines.push(``);

    for (const exportPath of exportPaths) {
        lines.push(`export * from "${exportPath}";`);
    }

    lines.push(``);
    return lines.join("\n");
}

export function readActualIndexExports(pageRegistryDir: string): string[] {
    const filePath = getIndexFile(pageRegistryDir);
    if (!fs.existsSync(filePath)) return [];
    return extractIndexExportPaths(fs.readFileSync(filePath, "utf8"));
}
