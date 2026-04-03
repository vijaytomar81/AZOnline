// src/pageActionTools/page-action-repair/repair/rules/registry/repairIndexExports.ts

import { ensurePageActionIndexes } from "@pageActionTools/page-action-generator/generator/ensurePageActionIndexes";
import { loadPageObjectManifestIndex } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestIndex";
import { loadPageObjectManifestPage } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestPage";
import { buildActionName } from "@pageActionTools/page-action-generator/generator/buildActionName";
import { buildActionPath } from "@pageActionTools/page-action-generator/generator/buildActionPath";
import type { RepairRule } from "../../types";

export const repairIndexExports: RepairRule = {
    category: "registry",
    name: "repairIndexExports",
    description: "Repair missing page action index exports",
    run: () => {
        const pageObjectIndex = loadPageObjectManifestIndex();
        const appliedFixes: string[] = [];

        Object.keys(pageObjectIndex.pages).sort().forEach((pageKey) => {
            const page = loadPageObjectManifestPage(pageObjectIndex.pages[pageKey]);
            const naming = buildActionName(page);
            const paths = buildActionPath({ page, naming });
            ensurePageActionIndexes({ naming, paths });
            appliedFixes.push(`Ensured exports for ${pageKey}`);
        });

        return {
            category: "registry",
            name: "repairIndexExports",
            appliedFixes,
            issues: [],
        };
    },
};
