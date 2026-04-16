// src/toolingLayer/pageObjects/common/artifacts/getPageArtifactPaths.ts

import { buildPageArtifact } from "./buildPageArtifact";

export function getPageArtifactPaths(pageObjectsDir: string, pageKey: string) {
    return buildPageArtifact(pageObjectsDir, pageKey);
}
