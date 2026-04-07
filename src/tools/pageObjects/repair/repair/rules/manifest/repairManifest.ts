// src/tools/pageObjects/repair/repair/rules/manifest/repairManifest.ts

import type { TreeNode } from "@utils/cliTree";
import type { RepairRule } from "../../pipeline/types";
import type { ManifestPageEntry, PageObjectsManifest } from "../../shared/manifest";
import { buildManifest, readManifest, writeManifest } from "../../shared/manifest";

type RenamePair = {
    oldOuterKey: string;
    newOuterKey: string;
};

function isSameLogicalEntry(
    oldEntry: ManifestPageEntry | undefined,
    newEntry: ManifestPageEntry | undefined
): boolean {
    if (!oldEntry || !newEntry) return false;

    return (
        oldEntry.pageKey === newEntry.pageKey &&
        oldEntry.className === newEntry.className &&
        oldEntry.paths.pageMapFile === newEntry.paths.pageMapFile
    );
}

function findRenamePairs(
    oldPages: Record<string, ManifestPageEntry>,
    newPages: Record<string, ManifestPageEntry>
): RenamePair[] {
    const removedKeys = Object.keys(oldPages).filter((key) => !(key in newPages));
    const addedKeys = Object.keys(newPages).filter((key) => !(key in oldPages));
    const usedAdded = new Set<string>();
    const pairs: RenamePair[] = [];

    for (const oldOuterKey of removedKeys) {
        for (const newOuterKey of addedKeys) {
            if (usedAdded.has(newOuterKey)) continue;
            if (isSameLogicalEntry(oldPages[oldOuterKey], newPages[newOuterKey])) {
                usedAdded.add(newOuterKey);
                pairs.push({ oldOuterKey, newOuterKey });
                break;
            }
        }
    }

    return pairs;
}

function buildRenameNodes(renamePairs: RenamePair[]): TreeNode[] {
    return renamePairs.map((pair) => ({
        title: "index.json",
        children: [
            {
                title: pair.newOuterKey,
                children: [
                    {
                        severity: "warning",
                        title: "Old",
                        summary: `[manifestEntryKey=${pair.oldOuterKey}]`,
                    },
                    {
                        severity: "success",
                        title: "Updated",
                        summary: `[manifestEntryKey=${pair.newOuterKey}]`,
                    },
                ],
            },
        ],
    }));
}

function buildChangedEntryNodes(
    oldPages: Record<string, ManifestPageEntry>,
    newPages: Record<string, ManifestPageEntry>,
    consumed: Set<string>
): TreeNode[] {
    const nodes: TreeNode[] = [];

    for (const pageKey of Object.keys(newPages).sort((a, b) => a.localeCompare(b))) {
        if (!(pageKey in oldPages) || consumed.has(pageKey)) continue;

        const oldEntry = oldPages[pageKey];
        const newEntry = newPages[pageKey];

        if (JSON.stringify(oldEntry) === JSON.stringify(newEntry)) continue;

        nodes.push({
            title: `${pageKey}.json`,
            children: [
                {
                    title: pageKey,
                    children: [
                        {
                            severity: "warning",
                            title: "Old",
                            summary: `[pageKey=${oldEntry.pageKey}, elementCount=${oldEntry.elementCount}, mapHash=${oldEntry.mapHash}]`,
                        },
                        {
                            severity: "success",
                            title: "Updated",
                            summary: `[pageKey=${newEntry.pageKey}, elementCount=${newEntry.elementCount}, mapHash=${newEntry.mapHash}]`,
                        },
                    ],
                },
            ],
        });
    }

    return nodes;
}

function buildManifestRepairReport(
    oldManifest: PageObjectsManifest,
    newManifest: PageObjectsManifest
): { repairedPages: number; reportNodes: TreeNode[] } {
    const oldPages = oldManifest.pages;
    const newPages = newManifest.pages;

    const renamePairs = findRenamePairs(oldPages, newPages);
    const consumed = new Set<string>([
        ...renamePairs.map((x) => x.oldOuterKey),
        ...renamePairs.map((x) => x.newOuterKey),
    ]);

    const reportNodes = [
        ...buildRenameNodes(renamePairs),
        ...buildChangedEntryNodes(oldPages, newPages, consumed),
    ];

    return {
        repairedPages: reportNodes.length,
        reportNodes,
    };
}

export const repairManifest: RepairRule = {
    id: "repair.manifest",
    description: "Repair manifest from page maps and generated artifacts",
    run(ctx) {
        const oldManifest = readManifest(ctx.manifestFile);
        const newManifest = buildManifest(ctx.pageObjectsDir, ctx.mapsDir);
        const { repairedPages, reportNodes } = buildManifestRepairReport(oldManifest, newManifest);

        if (repairedPages === 0) {
            return { changedFiles: 0, repairedPages: 0, reportNodes: [] };
        }

        writeManifest(ctx.manifestFile, newManifest);

        return {
            changedFiles: 1,
            repairedPages,
            reportNodes,
        };
    },
};