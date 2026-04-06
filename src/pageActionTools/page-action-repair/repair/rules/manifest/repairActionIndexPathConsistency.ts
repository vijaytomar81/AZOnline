// src/pageActionTools/page-action-repair/repair/rules/manifest/repairActionIndexPathConsistency.ts

import path from "node:path";
import { PAGE_ACTIONS_MANIFEST_DIR, toRepoRelative } from "@utils/paths";
import { buildActionName } from "@pageActionTools/page-action-generator/generator/buildActionName";
import { buildActionPath } from "@pageActionTools/page-action-generator/generator/buildActionPath";
import { loadPageObjectManifestIndex } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestIndex";
import { loadPageObjectManifestPage } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestPage";
import { readJson, writeJson } from "../../shared/manifest";
import type { RepairRule } from "../../types";

export const repairActionIndexPathConsistency: RepairRule = {
    category: "manifest",
    name: "repairActionIndexPathConsistency",
    description: "Repair manifest indexFile paths to expected platform index paths",
    run: () => {
        const pageObjectIndex = loadPageObjectManifestIndex();
        const manifestIndex = readJson<{ actions: Record<string, string> }>(
            path.join(PAGE_ACTIONS_MANIFEST_DIR, "index.json"),
            { actions: {} }
        );

        const appliedFixes = Object.entries(manifestIndex.actions).flatMap(
            ([pageKey, fileName]) => {
                const pageManifestFile = pageObjectIndex.pages[pageKey];

                if (!pageManifestFile) {
                    return [];
                }

                const page = loadPageObjectManifestPage(pageManifestFile);
                const naming = buildActionName(page);
                const paths = buildActionPath({ page, naming });
                const manifestFilePath = path.join(
                    PAGE_ACTIONS_MANIFEST_DIR,
                    "actions",
                    fileName
                );

                const entry = readJson<any>(manifestFilePath, {});
                const incorrectValueFound = entry.paths?.indexFile;
                const fixReplacedValue = toRepoRelative(paths.platformIndexFile);

                if (incorrectValueFound === fixReplacedValue) {
                    return [];
                }

                entry.paths = {
                    ...entry.paths,
                    indexFile: fixReplacedValue,
                };

                writeJson(manifestFilePath, entry);

                return [{
                    key: pageKey,
                    message: "Fixed manifest indexFile path.",
                    meta: {
                        filePath: toRepoRelative(manifestFilePath),
                        incorrectValueFound,
                        fixReplacedValue,
                    },
                }];
            }
        );

        return {
            category: "manifest",
            name: "repairActionIndexPathConsistency",
            appliedFixes,
            issues: [],
        };
    },
};
