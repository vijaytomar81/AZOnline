// src/tools/page-object-generator/generator/changeDetection.ts
import fs from "node:fs";

import { buildPageArtifact } from "./pageArtifact";
import type { PageRegistryEntry } from "./registry";

function mtimeMsSafe(filePath: string): number {
    try {
        return fs.statSync(filePath).mtimeMs;
    } catch {
        return 0;
    }
}

export function needsAliasSync(params: {
    pageObjectsDir: string;
    pageKey: string;
}): boolean {
    const { pageObjectsDir, pageKey } = params;

    const artifact = buildPageArtifact(pageObjectsDir, pageKey);

    if (!fs.existsSync(artifact.aliasesHumanPath) || !fs.existsSync(artifact.pageObjectPath)) {
        return false;
    }

    return mtimeMsSafe(artifact.aliasesHumanPath) > mtimeMsSafe(artifact.pageObjectPath);
}

export function buildRegistryEntry(pageKey: string, pageObjectsDir: string): PageRegistryEntry {
    const artifact = buildPageArtifact(pageObjectsDir, pageKey);

    return {
        pageKey,
        className: artifact.className,
    };
}