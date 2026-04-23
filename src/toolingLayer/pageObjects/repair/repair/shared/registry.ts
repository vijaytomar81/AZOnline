// src/toolingLayer/pageObjects/repair/repair/shared/registry.ts

import fs from "node:fs";

import { safeReadText } from "@utils/fs";
import { PAGE_OBJECTS_ROOT_DIR } from "@utils/paths";
import {
    getIndexFile,
    getPageArtifactPaths,
} from "@toolingLayer/pageObjects/common/pagePaths";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";
import {
    headerFilePath,
    headerGeneratedFromManifest,
    getIndexFileParts,
} from "@toolingLayer/pageObjects/generator/utils/buildGeneratedHeader";

function ensureTrailingNewline(text: string): string {
    return text.endsWith("\n") ? text : `${text}\n`;
}

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
    pageRegistryDir = PAGE_OBJECTS_ROOT_DIR
): string {
    const exportPaths = buildExpectedIndexExports(pageObjectsDir, mapsDir);
    const lines: string[] = [
        headerFilePath(getIndexFileParts()),
        headerGeneratedFromManifest(),
        ``,
        `export * from "./pageManager";`,
        ...exportPaths.map((exportPath) => `export * from "${exportPath}";`),
        ``,
    ];

    return ensureTrailingNewline(lines.join("\n"));
}

export function readActualIndexExports(pageRegistryDir: string): string[] {
    const filePath = getIndexFile(pageRegistryDir);
    if (!fs.existsSync(filePath)) return [];
    return extractIndexExportPaths(fs.readFileSync(filePath, "utf8"));
}

export function readActualIndexFile(pageRegistryDir: string): string {
    const filePath = getIndexFile(pageRegistryDir);
    return safeReadText(filePath) ?? "";
}
