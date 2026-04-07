// src/tools/pageObjects/repair/repair/rules/pageChain/repairElementsToGeneratedAliases.ts

import fs from "node:fs";

import type { TreeNode } from "@utils/cliTree";
import { isValidTsIdentifier } from "@utils/ts";
import { toRepoRelative } from "@utils/paths";
import type { RepairRule } from "../../pipeline/types";
import { readElementsInfo } from "../../shared/elements";
import { getPageArtifactPaths } from "@pageObjectCommon/pagePaths";
import { loadAllPageMaps } from "@pageObjectCommon/readPageMap";
import { extractExportedObjectKeys } from "@pageObjectCommon/extractTsObjectKeys";

function prop(key: string): string {
    return isValidTsIdentifier(key) ? key : JSON.stringify(key);
}

function list(values: string[]): string {
    return `[${values.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

function diff(oldKeys: string[], newKeys: string[]): { removed: string[]; added: string[] } {
    const oldSet = new Set(oldKeys);
    const newSet = new Set(newKeys);

    return {
        removed: oldKeys.filter((key) => !newSet.has(key)),
        added: newKeys.filter((key) => !oldSet.has(key)),
    };
}

function buildDiffChildren(oldKeys: string[], newKeys: string[]): TreeNode[] {
    const { removed, added } = diff(oldKeys, newKeys);
    const children: TreeNode[] = [];

    if (removed.length > 0) {
        children.push({
            severity: "warning",
            title: "Old",
            summary: list(removed),
        });
    }

    if (added.length > 0) {
        children.push({
            severity: "success",
            title: "Updated",
            summary: list(added),
        });
    }

    return children;
}

function writeGeneratedFile(filePath: string, pageKey: string, keys: string[]): void {
    const oldText = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
    const pageMetaMatch = oldText.match(/export const pageMeta = \{[\s\S]*?\} as const;/m);
    const pageMetaBlock =
        pageMetaMatch?.[0] ??
        `export const pageMeta = {\n  pageKey: ${JSON.stringify(pageKey)},\n} as const;`;

    const lines = [
        `// ${toRepoRelative(filePath)}`,
        `// REPAIRED FILE`,
        `// pageKey: ${pageKey}`,
        ``,
        `import type { ElementKey } from "./elements";`,
        ``,
        pageMetaBlock,
        ``,
        `export const aliasesGenerated = {`,
        ...keys.map((key) => `  ${prop(key)}: ${JSON.stringify(key)} as ElementKey,`),
        `} as const;`,
        ``,
        `export type AliasGeneratedKey = keyof typeof aliasesGenerated;`,
        ``,
    ];

    fs.writeFileSync(filePath, lines.join("\n"), "utf8");
}

export const repairElementsToGeneratedAliases: RepairRule = {
    id: "repair.elementsToGeneratedAliases",
    description: "Repair aliases.generated.ts from elements.ts",
    run(ctx) {
        const reportNodes: TreeNode[] = [];
        let changedFiles = 0;
        let repairedPages = 0;

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const artifact = getPageArtifactPaths(ctx.pageObjectsDir, item.pageMap.pageKey);
            const oldKeys = fs.existsSync(artifact.aliasesGeneratedPath)
                ? [...extractExportedObjectKeys(fs.readFileSync(artifact.aliasesGeneratedPath, "utf8"), "aliasesGenerated")]
                : [];
            const newKeys = readElementsInfo(artifact.elementsPath).map((x) => x.key);

            if (list(oldKeys) === list(newKeys)) {
                continue;
            }

            writeGeneratedFile(artifact.aliasesGeneratedPath, item.pageMap.pageKey, newKeys);
            changedFiles++;
            repairedPages++;

            reportNodes.push({
                title: item.pageMap.pageKey,
                children: [
                    {
                        title: "aliases.generated.ts",
                        children: buildDiffChildren(oldKeys, newKeys),
                    },
                ],
            });
        }

        return { changedFiles, repairedPages, reportNodes };
    },
};