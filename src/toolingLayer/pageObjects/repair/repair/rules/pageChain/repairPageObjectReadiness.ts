// src/toolingLayer/pageObjects/repair/repair/rules/pageChain/repairPageObjectReadiness.ts

import fs from "node:fs";

import type { TreeNode } from "@utils/cliTree";
import type { RepairRule } from "../../pipeline/types";
import { getPageArtifactPaths } from "@toolingLayer/pageObjects/common/pagePaths";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";
import {
    extractReadinessAliasKeys,
    replaceReadinessBlock,
    sameAliasKeys,
} from "../../shared/pageObjectReadiness";

type PageMapWithReadiness = {
    pageKey: string;
    readiness?: {
        recommendedAliases?: string[];
    };
};

function list(values: string[]): string {
    return `[${values.sort((a, b) => a.localeCompare(b)).join(", ")}]`;
}

function diffAliases(oldKeys: string[], newKeys: string[]): {
    removed: string[];
    added: string[];
} {
    const oldSet = new Set(oldKeys);
    const newSet = new Set(newKeys);

    return {
        removed: oldKeys.filter((key) => !newSet.has(key)),
        added: newKeys.filter((key) => !oldSet.has(key)),
    };
}

function buildDiffChildren(oldKeys: string[], newKeys: string[]): TreeNode[] {
    const { removed, added } = diffAliases(oldKeys, newKeys);
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

function recommendedAliases(pageMap: PageMapWithReadiness): string[] {
    return Array.isArray(pageMap.readiness?.recommendedAliases)
        ? pageMap.readiness!.recommendedAliases
        : [];
}

export const repairPageObjectReadiness: RepairRule = {
    id: "repair.pageObjectReadiness",
    description: "Repair page object readiness wiring from page-map readiness metadata",
    run(ctx) {
        const reportNodes: TreeNode[] = [];
        let changedFiles = 0;
        let repairedPages = 0;

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const pageMap = item.pageMap as PageMapWithReadiness;
            const artifact = getPageArtifactPaths(ctx.pageObjectsDir, pageMap.pageKey);

            if (!fs.existsSync(artifact.pageObjectPath)) {
                continue;
            }

            const pageTs = fs.readFileSync(artifact.pageObjectPath, "utf8");
            const oldAliases = extractReadinessAliasKeys(pageTs);
            const newAliases = recommendedAliases(pageMap);

            if (sameAliasKeys(oldAliases, newAliases)) {
                continue;
            }

            const updatedPageTs = replaceReadinessBlock(pageTs, newAliases);

            if (updatedPageTs === pageTs) {
                continue;
            }

            fs.writeFileSync(artifact.pageObjectPath, updatedPageTs, "utf8");
            changedFiles++;
            repairedPages++;

            reportNodes.push({
                title: pageMap.pageKey,
                children: [
                    {
                        title: `${artifact.className}.ts`,
                        children: buildDiffChildren(oldAliases, newAliases),
                    },
                ],
            });
        }

        return { changedFiles, repairedPages, reportNodes };
    },
};
