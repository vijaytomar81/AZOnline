// src/pageActionTools/page-action-repair/repair/rules/manifest/repairActionFilePathConsistency.ts

import path from "node:path";
import { PAGE_ACTIONS_MANIFEST_DIR, toRepoRelative } from "@utils/paths";
import { buildActionName } from "@pageActionTools/page-action-generator/generator/buildActionName";
import { buildActionPath } from "@pageActionTools/page-action-generator/generator/buildActionPath";
import { loadPageObjectManifestIndex } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestIndex";
import { loadPageObjectManifestPage } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestPage";
import { readJson, writeJson } from "../../shared/manifest";
import type { RepairRule } from "../../types";

export const repairActionFilePathConsistency: RepairRule = {
    category: "manifest",
    name: "repairActionFilePathConsistency",
    description: "Repair manifest actionFile paths to expected generator paths",
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
                const incorrectValueFound = entry.paths?.actionFile;
                const fixReplacedValue = toRepoRelative(paths.actionFile);

                if (incorrectValueFound === fixReplacedValue) {
                    return [];
                }

                entry.paths = {
                    ...entry.paths,
                    actionFile: fixReplacedValue,
                };

                writeJson(manifestFilePath, entry);

                return [{
                    key: pageKey,
                    message: "Fixed manifest actionFile path.",
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
            name: "repairActionFilePathConsistency",
            appliedFixes,
            issues: [],
        };
    },
};
