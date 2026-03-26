// src/tools/page-object-repair/repair/rules/registry/repairPageManager.ts

import fs from "node:fs";

import type { TreeNode } from "@utils/cliTree";
import { getPageManagerFile } from "@/tools/page-object-common/pagePaths";
import type { RepairRule } from "../../pipeline/types";
import {
    buildPageManagerContent,
    buildPageManagerEntries,
    readActualPageManagerState,
} from "../../shared/pageManager";

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

export const repairPageManager: RepairRule = {
    id: "repair.pageManager",
    description: "Repair src/pages/pageManager.ts from actual page objects",
    run(ctx) {
        const filePath = getPageManagerFile(ctx.pageRegistryDir);
        const oldState = readActualPageManagerState(ctx.pageRegistryDir);
        const entries = buildPageManagerEntries(ctx.pageObjectsDir, ctx.mapsDir);

        const oldValues = [
            ...oldState.imports.map((value) => `import:${value}`),
            ...oldState.keys.map((value) => `key:${value}`),
        ].sort((a, b) => a.localeCompare(b));

        const newImports = entries.map((x) => x.importPath).sort((a, b) => a.localeCompare(b));
        const newKeys = entries.map((x) => `${x.product}.${x.member}`).sort((a, b) => a.localeCompare(b));

        const newValues = [
            ...newImports.map((value) => `import:${value}`),
            ...newKeys.map((value) => `key:${value}`),
        ].sort((a, b) => a.localeCompare(b));

        if (list(oldValues) === list(newValues)) {
            return { changedFiles: 0, repairedPages: 0, reportNodes: [] };
        }

        fs.writeFileSync(filePath, buildPageManagerContent(ctx.pageObjectsDir, ctx.mapsDir), "utf8");

        const reportNodes: TreeNode[] = [
            {
                title: "registry",
                children: [
                    {
                        title: "pageManager.ts",
                        children: buildDiffChildren(oldValues, newValues),
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