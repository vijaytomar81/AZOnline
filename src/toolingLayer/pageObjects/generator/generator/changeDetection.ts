// src/toolingLayer/pageObjects/generator/generator/changeDetection.ts

import { buildPageArtifact } from "./pageArtifact";
import type { PageRegistryEntry } from "./registry";

export function buildRegistryEntry(pageKey: string, pageObjectsDir: string): PageRegistryEntry {
    const artifact = buildPageArtifact(pageObjectsDir, pageKey);

    return {
        pageKey,
        className: artifact.className,
    };
}