// src/tools/page-object-repair/repair/shared/registry.ts

import fs from "node:fs";

import { getIndexFile, getPageArtifactPaths } from "@/tools/page-object-common/pagePaths";
import { loadAllPageMaps } from "@/tools/page-object-common/readPageMap";

export function extractIndexExportPaths(tsText: string): string[] {
    return [...tsText.matchAll(/export\s+\*\s+from\s+"([^"]+)";/g)]
        .map((m) => m[1] ?? "")
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
}

export function buildExpectedIndexExports(pageObjectsDir: string, mapsDir: string): string[] {
    return loadAllPageMaps(mapsDir)
        .map((item) => {
            const artifact = getPageArtifactPaths(pageObjectsDir, item.pageMap.pageKey);
            const parts = item.pageMap.pageKey.split(".");
            const product = parts[0] ?? "unknown";
            const group = parts[1] ?? "common";
            const name = parts.slice(2).join(".");
            return `@page-objects/${product}/${group}/${name}/${artifact.className}`;
        })
        .sort((a, b) => a.localeCompare(b));
}

export function buildIndexFileContent(pageObjectsDir: string, mapsDir: string): string {
    const exportPaths = buildExpectedIndexExports(pageObjectsDir, mapsDir);
    const lines: string[] = [];

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