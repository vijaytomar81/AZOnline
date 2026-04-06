// src/pageActionTools/page-action-repair/repair/rules/manifest/repairManifestIndexConsistency.ts

import fs from "node:fs";
import path from "node:path";
import { PAGE_ACTIONS_MANIFEST_DIR, toRepoRelative } from "@utils/paths";
import { readJson, writeJson } from "../../shared/manifest";
import type { RepairAppliedFix, RepairRule } from "../../types";

export const repairManifestIndexConsistency: RepairRule = {
    category: "manifest",
    name: "repairManifestIndexConsistency",
    description: "Repair page action manifest index to match manifest entry files",
    run: () => {
        const manifestIndexFile = path.join(PAGE_ACTIONS_MANIFEST_DIR, "index.json");
        const manifestActionsDir = path.join(PAGE_ACTIONS_MANIFEST_DIR, "actions");

        const index = readJson<{
            version?: number;
            generatedAt?: string;
            actions: Record<string, string>;
        }>(manifestIndexFile, { version: 1, generatedAt: "", actions: {} });

        const appliedFixes: RepairAppliedFix[] = [];
        const actualFiles = fs.existsSync(manifestActionsDir)
            ? fs.readdirSync(manifestActionsDir).filter((file) => file.endsWith(".json"))
            : [];

        actualFiles.forEach((fileName) => {
            const filePath = path.join(manifestActionsDir, fileName);
            const entry = readJson<{ pageKey?: string }>(filePath, {});

            if (!entry.pageKey) {
                return;
            }

            const incorrectValueFound = index.actions[entry.pageKey];

            if (incorrectValueFound === fileName) {
                return;
            }

            index.actions[entry.pageKey] = fileName;

            appliedFixes.push({
                key: entry.pageKey,
                message: "Aligned manifest index entry.",
                meta: {
                    filePath: toRepoRelative(manifestIndexFile),
                    incorrectValueFound: incorrectValueFound ?? "(missing index entry)",
                    fixReplacedValue: fileName,
                },
            });
        });

        Object.entries(index.actions).forEach(([pageKey, fileName]) => {
            const filePath = path.join(manifestActionsDir, fileName);

            if (fs.existsSync(filePath)) {
                return;
            }

            delete index.actions[pageKey];

            appliedFixes.push({
                key: pageKey,
                message: "Removed stale manifest index entry.",
                meta: {
                    filePath: toRepoRelative(manifestIndexFile),
                    incorrectValueFound: fileName,
                    fixReplacedValue: "(removed stale entry)",
                },
            });
        });

        index.generatedAt = new Date().toISOString();
        writeJson(manifestIndexFile, index);

        return {
            category: "manifest",
            name: "repairManifestIndexConsistency",
            appliedFixes,
            issues: [],
        };
    },
};
