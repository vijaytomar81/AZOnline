// src/toolingLayer/pageObjects/common/manifest/manifestPaths.ts

import path from "node:path";

function toPosix(value: string): string {
    return value.replace(/\\/g, "/");
}

export function normalizeManifestRoot(inputPath: string): string {
    return inputPath.endsWith(".json") ? path.dirname(inputPath) : inputPath;
}

export function getManifestIndexFile(inputPath: string): string {
    return inputPath.endsWith(".json")
        ? inputPath
        : path.join(inputPath, "index.json");
}

export function getManifestEntryRelativePath(pageKey: string): string {
    return `${pageKey.split(".").join("/")}.json`;
}

export function getManifestEntryFile(
    manifestRoot: string,
    pageKey: string
): string {
    return path.join(
        normalizeManifestRoot(manifestRoot),
        getManifestEntryRelativePath(pageKey)
    );
}

export function toManifestRelativePath(
    manifestRoot: string,
    filePath: string
): string {
    return toPosix(path.relative(normalizeManifestRoot(manifestRoot), filePath));
}
