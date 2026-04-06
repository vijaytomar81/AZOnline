// src/pageActionTools/page-action-validator/validate/rules/manifest/checkActionIndexPathConsistency.ts

import { toRepoRelative } from "@utils/paths";
import { buildActionName } from "@pageActionTools/page-action-generator/generator/buildActionName";
import { buildActionPath } from "@pageActionTools/page-action-generator/generator/buildActionPath";
import { loadPageObjectManifestPage } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestPage";
import type { ValidationRule } from "../../types";

export const checkActionIndexPathConsistency: ValidationRule = {
    category: "manifest",
    name: "checkActionIndexPathConsistency",
    description: "Validate manifest indexFile path matches expected platform index path",
    run: (context) => {
        const issues = Object.entries(context.pageActionEntries).flatMap(
            ([pageKey, entry]) => {
                const pageManifestFile = context.pageObjectIndex[pageKey];

                if (!pageManifestFile) {
                    return [];
                }

                const page = loadPageObjectManifestPage(pageManifestFile);
                const naming = buildActionName(page);
                const paths = buildActionPath({ page, naming });

                const expected = toRepoRelative(paths.platformIndexFile);
                const actual = entry.paths.indexFile;

                return expected === actual
                    ? []
                    : [{
                        level: "error" as const,
                        key: pageKey,
                        message: "Manifest indexFile path does not match expected platform index path.",
                        meta: {
                            filePath: actual,
                            expected,
                            actual,
                        },
                    }];
            }
        );

        return {
            category: "manifest",
            name: "checkActionIndexPathConsistency",
            issues,
        };
    },
};
