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
        .map((match) => match[1] ?? "")
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
}

export function buildExpectedIndexExports(
    pageObjectsDir: string,
    mapsDir: string
): string[] {
    return loadAllPageMaps(mapsDir)
        .map((item) => getPageArtifactPaths(pageObjectsDir, item.pageMap.pageKey))
        .map((artifact) => artifact.registryImportPath)
        .sort((a, b) => a.localeCompare(b));
}

export function buildIndexFileContent(
    pageObjectsDir: string,
    mapsDir: string,
    pageRegistryDir: string
): string {
    const exportPaths = buildExpectedIndexExports(pageObjectsDir, mapsDir);
    const filePath = getIndexFile(pageRegistryDir);
    const lines: string[] = [
        `// ${toRepoRelative(filePath)}`,
        `// AUTO-GENERATED from src/pageObjects/.manifest/`,
        ``,
        `export { PageManager } from "./pageManager";`,
        ``,
        `// Export individual pages too (optional, but useful sometimes)`,
        ``,
    ];

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
