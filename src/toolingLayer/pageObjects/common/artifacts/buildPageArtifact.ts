// src/toolingLayer/pageObjects/common/artifacts/buildPageArtifact.ts

import path from "node:path";

import { toPascal } from "@utils/ts";
import type { PageArtifact } from "./types";

function pageKeyToFolderSegments(pageKey: string): string[] {
    return pageKey.split(".").filter(Boolean);
}

function lastSegment(pageKey: string): string {
    return pageKey.split(".").slice(-1)[0] || "Page";
}

export function buildPageArtifact(
    pageObjectsDir: string,
    pageKey: string
): PageArtifact {
    const className = `${toPascal(lastSegment(pageKey))}Page`;
    const folderPath = path.join(pageObjectsDir, ...pageKeyToFolderSegments(pageKey));
    const objectPath = pageKey.split(".").join("/");

    return {
        pageKey,
        className,
        folderPath,
        elementsPath: path.join(folderPath, "elements.ts"),
        aliasesGeneratedPath: path.join(folderPath, "aliases.generated.ts"),
        aliasesHumanPath: path.join(folderPath, "aliases.ts"),
        pageObjectPath: path.join(folderPath, `${className}.ts`),
        registryImportPath: `@businessLayer/pageObjects/objects/${objectPath}/${className}`,
    };
}
