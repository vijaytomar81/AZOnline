// src/tools/pageObjects/common/pagePaths.ts

import path from "node:path";

import { buildPageArtifact } from "@toolingLayer/pageObjects/generator/generator/pageArtifact";

export function getPageArtifactPaths(pageObjectsDir: string, pageKey: string) {
    return buildPageArtifact(pageObjectsDir, pageKey);
}

export function getIndexFile(pageRegistryDir: string): string {
    return path.join(pageRegistryDir, "index.ts");
}

export function getPageManagerFile(pageRegistryDir: string): string {
    return path.join(pageRegistryDir, "pageManager.ts");
}