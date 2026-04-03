// src/pageActionTools/page-action-repair/repair/rules/manifest/repairActionKeyConsistency.ts

import path from "node:path";
import { PAGE_ACTIONS_MANIFEST_DIR } from "@utils/paths";
import { readJson, writeJson } from "../../shared/manifest";
import type { RepairRule } from "../../types";

export const repairActionKeyConsistency: RepairRule = {
    category: "manifest",
    name: "repairActionKeyConsistency",
    description: "Repair incorrect page action manifest actionKey values",
    run: () => {
        const index = readJson<{ actions: Record<string, string> }>(
            path.join(PAGE_ACTIONS_MANIFEST_DIR, "index.json"),
            { actions: {} }
        );

        const appliedFixes: string[] = [];

        Object.entries(index.actions).forEach(([pageKey, fileName]) => {
            const filePath = path.join(PAGE_ACTIONS_MANIFEST_DIR, "actions", fileName);
            const entry = readJson<any>(filePath, {});
            const [platform, group] = pageKey.split(".");
            const fileBase = path.basename(entry.paths.actionFile ?? "", ".ts");
            const expected = `${platform}.${group}.${fileBase}.action`;

            if (entry.actionKey !== expected) {
                entry.actionKey = expected;
                writeJson(filePath, entry);
                appliedFixes.push(`Fixed actionKey for ${pageKey}`);
            }
        });

        return {
            category: "manifest",
            name: "repairActionKeyConsistency",
            appliedFixes,
            issues: [],
        };
    },
};
