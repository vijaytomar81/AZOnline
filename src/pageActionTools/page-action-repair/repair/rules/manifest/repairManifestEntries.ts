// src/pageActionTools/page-action-repair/repair/rules/manifest/repairManifestEntries.ts

import fs from "node:fs";
import path from "node:path";
import {
    buildActionName,
} from "@pageActionTools/page-action-generator/generator/buildActionName";
import { buildActionPath } from "@pageActionTools/page-action-generator/generator/buildActionPath";
import { buildPageActionManifestEntry } from "@pageActionTools/page-action-generator/generator/buildPageActionManifestEntry";
import { loadPageActionManifestIndex } from "@pageActionTools/page-action-generator/generator/loadPageActionManifestIndex";
import { loadPageObjectManifestIndex } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestIndex";
import { loadPageObjectManifestPage } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestPage";
import { writePageActionManifestEntry } from "@pageActionTools/page-action-generator/generator/writePageActionManifestEntry";
import { writePageActionManifestIndex } from "@pageActionTools/page-action-generator/generator/writePageActionManifestIndex";
import type { RepairRule } from "../../types";

export const repairManifestEntries: RepairRule = {
    category: "manifest",
    name: "repairManifestEntries",
    description: "Create missing page action manifest entries for existing actions",
    run: () => {
        const pageObjectIndex = loadPageObjectManifestIndex();
        const pageActionIndex = loadPageActionManifestIndex();
        const appliedFixes: string[] = [];

        Object.keys(pageObjectIndex.pages).sort().forEach((pageKey) => {
            if (pageActionIndex.actions[pageKey]) return;
            const page = loadPageObjectManifestPage(pageObjectIndex.pages[pageKey]);
            const naming = buildActionName(page);
            const paths = buildActionPath({ page, naming });

            if (!fs.existsSync(paths.actionFile)) return;

            const entry = buildPageActionManifestEntry({ page, naming, paths });
            writePageActionManifestEntry({ filePath: paths.manifestEntryFile, entry });
            pageActionIndex.actions[pageKey] = path.basename(paths.manifestEntryFile);
            appliedFixes.push(`Created manifest entry for ${pageKey}`);
        });

        writePageActionManifestIndex({
            filePath: `${process.cwd()}/src/pageActions/.manifest/index.json`,
            index: {
                ...pageActionIndex,
                generatedAt: new Date().toISOString(),
            },
        });

        return {
            category: "manifest",
            name: "repairManifestEntries",
            appliedFixes,
            issues: [],
        };
    },
};
