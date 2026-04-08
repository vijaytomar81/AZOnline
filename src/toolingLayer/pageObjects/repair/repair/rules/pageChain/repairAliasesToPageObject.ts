// src/toolingLayer/pageObjects/repair/repair/rules/pageChain/repairAliasesToPageObject.ts

import fs from "node:fs";

import type { TreeNode } from "@utils/cliTree";
import type { RepairRule } from "../../pipeline/types";
import { readAliasPairs } from "../../shared/aliases";
import { readElementsInfo } from "../../shared/elements";
import { writeManagedRegion } from "../../shared/pageObject";
import { getPageArtifactPaths } from "@toolingLayer/pageObjects/common/pagePaths";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";

function extractManagedMethodNames(pageTs: string): string[] {
    const match = pageTs.match(/\/\/ <scanner:aliases>[\s\S]*?\/\/ <\/scanner:aliases>/m);
    const region = match?.[0] ?? "";
    return [...region.matchAll(/async\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/g)].map((m) => m[1]!);
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

export const repairAliasesToPageObject: RepairRule = {
    id: "repair.aliasesToPageObject",
    description: "Repair page object managed region from aliases.ts",
    run(ctx) {
        const reportNodes: TreeNode[] = [];
        let changedFiles = 0;
        let repairedPages = 0;

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const artifact = getPageArtifactPaths(ctx.pageObjectsDir, item.pageMap.pageKey);
            const aliasPairs = readAliasPairs(artifact.aliasesHumanPath);
            const elements = readElementsInfo(artifact.elementsPath);
            const oldMethods = fs.existsSync(artifact.pageObjectPath)
                ? extractManagedMethodNames(fs.readFileSync(artifact.pageObjectPath, "utf8"))
                : [];
            const newMethods = aliasPairs.map((x) => x.aliasKey);

            if (list(oldMethods) === list(newMethods)) {
                continue;
            }

            writeManagedRegion({
                pageObjectPath: artifact.pageObjectPath,
                pageKey: item.pageMap.pageKey,
                aliasPairs,
                elements,
            });

            changedFiles++;
            repairedPages++;

            reportNodes.push({
                title: item.pageMap.pageKey,
                children: [
                    {
                        title: `${artifact.className}.ts`,
                        children: buildDiffChildren(oldMethods, newMethods),
                    },
                ],
            });
        }

        return { changedFiles, repairedPages, reportNodes };
    },
};