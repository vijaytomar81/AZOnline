// src/pageActionTools/page-action-validator/validate/rules/manifest/checkActionKeyConsistency.ts

import path from "node:path";
import { toRepoRelative } from "@utils/paths";
import { buildActionName } from "@pageActionTools/page-action-generator/generator/buildActionName";
import { loadPageObjectManifestPage } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestPage";
import type { ValidationRule } from "../../types";

export const checkActionKeyConsistency: ValidationRule = {
    category: "manifest",
    name: "checkActionKeyConsistency",
    description: "Validate manifest actionKey matches expected naming convention",
    run: (context) => {
        const issues = Object.entries(context.pageActionEntries).flatMap(
            ([pageKey, entry]) => {
                const pageManifestFile = context.pageObjectIndex[pageKey];

                if (!pageManifestFile) {
                    return [];
                }

                const page = loadPageObjectManifestPage(pageManifestFile);
                const naming = buildActionName(page);
                const expected = naming.actionKey;
                const actual = entry.actionKey;
                const manifestFilePath = path.join(
                    context.pageActionManifestDir,
                    "actions",
                    context.pageActionIndex[pageKey]
                );

                return expected === actual
                    ? []
                    : [{
                        level: "error" as const,
                        key: pageKey,
                        message: "Action key mismatch.",
                        meta: {
                            filePath: toRepoRelative(manifestFilePath),
                            expected,
                            actual,
                        },
                    }];
            }
        );

        return {
            category: "manifest",
            name: "checkActionKeyConsistency",
            issues,
        };
    },
};
