// src/pageActionTools/page-action-validator/validate/rules/manifest/checkActionFilePathConsistency.ts

import { toRepoRelative } from "@utils/paths";
import { buildActionName } from "@pageActionTools/page-action-generator/generator/buildActionName";
import { buildActionPath } from "@pageActionTools/page-action-generator/generator/buildActionPath";
import { loadPageObjectManifestPage } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestPage";
import type { ValidationRule } from "../../types";

export const checkActionFilePathConsistency: ValidationRule = {
    category: "manifest",
    name: "checkActionFilePathConsistency",
    description: "Validate manifest actionFile path matches expected generator path",
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

                const expected = toRepoRelative(paths.actionFile);
                const actual = entry.paths.actionFile;

                return expected === actual
                    ? []
                    : [{
                        level: "error" as const,
                        key: pageKey,
                        message: "Manifest actionFile path does not match expected generator path.",
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
            name: "checkActionFilePathConsistency",
            issues,
        };
    },
};
