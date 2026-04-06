// src/pageActionTools/page-action-repair/repair/rules/manifest/repairActionKeyConsistency.ts

import path from "node:path";
import { PAGE_ACTIONS_MANIFEST_DIR, toRepoRelative } from "@utils/paths";
import { buildActionName } from "@pageActionTools/page-action-generator/generator/buildActionName";
import { loadPageObjectManifestIndex } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestIndex";
import { loadPageObjectManifestPage } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestPage";
import { readJson, writeJson } from "../../shared/manifest";
import type { RepairRule } from "../../types";

export const repairActionKeyConsistency: RepairRule = {
    category: "manifest",
    name: "repairActionKeyConsistency",
    description: "Repair incorrect page action manifest actionKey values",
    run: () => {
        const pageObjectIndex = loadPageObjectManifestIndex();
        const pageActionIndex = readJson<{ actions: Record<string, string> }>(
            path.join(PAGE_ACTIONS_MANIFEST_DIR, "index.json"),
            { actions: {} }
        );

        const appliedFixes = Object.entries(pageActionIndex.actions).flatMap(
            ([pageKey, fileName]) => {
                const pageManifestFile = pageObjectIndex.pages[pageKey];

                if (!pageManifestFile) {
                    return [];
                }

                const page = loadPageObjectManifestPage(pageManifestFile);
                const naming = buildActionName(page);

                const filePath = path.join(
                    PAGE_ACTIONS_MANIFEST_DIR,
                    "actions",
                    fileName
                );

                const entry = readJson<any>(filePath, {});
                const incorrectValueFound = entry.actionKey;
                const fixReplacedValue = naming.actionKey;

                if (incorrectValueFound === fixReplacedValue) {
                    return [];
                }

                entry.actionKey = fixReplacedValue;
                writeJson(filePath, entry);

                return [{
                    key: pageKey,
                    message: "Fixed actionKey.",
                    meta: {
                        filePath: toRepoRelative(filePath),
                        incorrectValueFound,
                        fixReplacedValue,
                    },
                }];
            }
        );

        return {
            category: "manifest",
            name: "repairActionKeyConsistency",
            appliedFixes,
            issues: [],
        };
    },
};
