// src/pageActionTools/page-action-repair/repair/rules/files/repairMissingActionFiles.ts

import fs from "node:fs";
import { generatePageActionsFromManifest } from "@pageActionTools/page-action-generator/generator/generatePageActionsFromManifest";
import { loadPageActionManifestIndex } from "@pageActionTools/page-action-generator/generator/loadPageActionManifestIndex";
import { writePageActionManifestIndex } from "@pageActionTools/page-action-generator/generator/writePageActionManifestIndex";
import type { RepairRule } from "../../types";

export const repairMissingActionFiles: RepairRule = {
    category: "files",
    name: "repairMissingActionFiles",
    description: "Regenerate missing page action files from page objects",
    run: () => {
        const index = loadPageActionManifestIndex();
        let removed = 0;

        Object.keys(index.actions).forEach((pageKey) => {
            const fileName = index.actions[pageKey];
            const entryPath = `${process.cwd()}/src/pageActions/.manifest/actions/${fileName}`;

            if (!fs.existsSync(entryPath)) {
                delete index.actions[pageKey];
                removed++;
            }
        });

        if (removed > 0) {
            writePageActionManifestIndex({
                filePath: `${process.cwd()}/src/pageActions/.manifest/index.json`,
                index,
            });
        }

        const summary = generatePageActionsFromManifest({ verbose: false });

        const appliedFixes =
            summary.generatedActions > 0
                ? [
                    {
                        message: `Generated ${summary.generatedActions} missing page action file(s).`,
                    },
                ]
                : [];

        return {
            category: "files",
            name: "repairMissingActionFiles",
            appliedFixes,
            issues: [],
        };
    },
};