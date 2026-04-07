// src/tools/pageObjects/repair/repair/rules/pageChain/repairGeneratedAliasesToAliases.ts

import type { TreeNode } from "@utils/cliTree";
import type { RepairRule } from "../../pipeline/types";
import {
    aliasPairText,
    buildRepairedAliasPairs,
    readAliasPairs,
    readGeneratedKeys,
    writeAliasesHumanFile,
} from "../../shared/aliases";
import { getPageArtifactPaths } from "@toolingLayer/pageObjects/common/pagePaths";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";

function list(values: string[]): string {
    return `[${values.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

function buildDiffChildren(params: {
    removedTexts: string[];
    addedTexts: string[];
}): TreeNode[] {
    const children: TreeNode[] = [];

    if (params.removedTexts.length > 0) {
        children.push({
            severity: "warning",
            title: "Old",
            summary: list(params.removedTexts),
        });
    }

    if (params.addedTexts.length > 0) {
        children.push({
            severity: "success",
            title: "Updated",
            summary: list(params.addedTexts),
        });
    }

    return children;
}

export const repairGeneratedAliasesToAliases: RepairRule = {
    id: "repair.generatedAliasesToAliases",
    description: "Repair aliases.ts from aliases.generated.ts without overwriting valid business alias names",
    run(ctx) {
        const reportNodes: TreeNode[] = [];
        let changedFiles = 0;
        let repairedPages = 0;

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const artifact = getPageArtifactPaths(ctx.pageObjectsDir, item.pageMap.pageKey);

            const existingPairs = readAliasPairs(artifact.aliasesHumanPath);
            const generatedKeys = readGeneratedKeys(artifact.aliasesGeneratedPath);

            const { updatedPairs, removedPairs, addedPairs } = buildRepairedAliasPairs(
                existingPairs,
                generatedKeys
            );

            if (removedPairs.length === 0 && addedPairs.length === 0) {
                continue;
            }

            writeAliasesHumanFile(artifact.aliasesHumanPath, item.pageMap.pageKey, updatedPairs);
            changedFiles++;
            repairedPages++;

            reportNodes.push({
                title: item.pageMap.pageKey,
                children: [
                    {
                        title: "aliases.ts",
                        children: buildDiffChildren({
                            removedTexts: removedPairs.map(aliasPairText),
                            addedTexts: addedPairs.map(aliasPairText),
                        }),
                    },
                ],
            });
        }

        return { changedFiles, repairedPages, reportNodes };
    },
};