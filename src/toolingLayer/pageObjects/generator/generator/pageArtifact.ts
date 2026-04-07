// src/tools/pageObjects/generator/generator/pageArtifact.ts

import path from "node:path";

import { toPascal } from "@utils/ts";

export type PageArtifact = {
    pageKey: string;
    className: string;
    folderPath: string;
    elementsPath: string;
    aliasesGeneratedPath: string;
    aliasesHumanPath: string;
    pageObjectPath: string;
    registryImportPath: string;
};

function pageKeyToFolderSegments(pageKey: string): string[] {
    return pageKey.split(".").filter(Boolean);
}

function lastSegment(pageKey: string): string {
    return pageKey.split(".").slice(-1)[0] || "Page";
}

export function buildPageArtifact(pageObjectsDir: string, pageKey: string): PageArtifact {
    const className = `${toPascal(lastSegment(pageKey))}Page`;
    const folderPath = path.join(pageObjectsDir, ...pageKeyToFolderSegments(pageKey));

    return {
        pageKey,
        className,
        folderPath,
        elementsPath: path.join(folderPath, "elements.ts"),
        aliasesGeneratedPath: path.join(folderPath, "aliases.generated.ts"),
        aliasesHumanPath: path.join(folderPath, "aliases.ts"),
        pageObjectPath: path.join(folderPath, `${className}.ts`),
        registryImportPath: `@businessLayer/pageObjects/objects/${pageKey.split(".").join("/")}/${className}`,
    };
}