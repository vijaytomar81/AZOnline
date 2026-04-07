// src/tools/pageObjects/repair/repair/rules/registry/repairIndexExports.ts

import fs from "node:fs";

import type { TreeNode } from "@utils/cliTree";
import { getIndexFile } from "@toolingLayer/pageObjects/common/pagePaths";
import type { RepairRule } from "../../pipeline/types";
import {
    buildExpectedIndexExports,
    buildIndexFileContent,
    readActualIndexExports,
} from "../../shared/registry";

function list(values: string[]): string {
    return `[${values.join(", ")}]`;
}

function diff(oldValues: string[], newValues: string[]): { removed: string[]; added: string[] } {
    const oldSet = new Set(oldValues);
    const newSet = new Set(newValues);

    return {
        removed: oldValues.filter((value) => !newSet.has(value)),
        added: newValues.filter((value) => !oldSet.has(value)),
    };
}

function buildDiffChildren(oldValues: string[], newValues: string[]): TreeNode[] {
    const { removed, added } = diff(oldValues, newValues);
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

export const repairIndexExports: RepairRule = {
    id: "repair.indexExports",
    description: "Repair src/pages/index.ts exports from actual page objects",
    run(ctx) {
        const filePath = getIndexFile(ctx.pageRegistryDir);
        const oldExports = readActualIndexExports(ctx.pageRegistryDir);
        const newExports = buildExpectedIndexExports(ctx.pageObjectsDir, ctx.mapsDir);

        if (list(oldExports) === list(newExports)) {
            return { changedFiles: 0, repairedPages: 0, reportNodes: [] };
        }

        fs.writeFileSync(
            filePath,
            buildIndexFileContent(
                ctx.pageObjectsDir,
                ctx.mapsDir,
                ctx.pageRegistryDir
            ),
            "utf8"
        );

        const reportNodes: TreeNode[] = [
            {
                title: "registry",
                children: [
                    {
                        title: "index.ts",
                        children: buildDiffChildren(oldExports, newExports),
                    },
                ],
            },
        ];

        return {
            changedFiles: 1,
            repairedPages: 1,
            reportNodes,
        };
    },
};
