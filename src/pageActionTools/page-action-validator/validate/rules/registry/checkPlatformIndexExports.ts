// src/pageActionTools/page-action-validator/validate/rules/registry/checkPlatformIndexExports.ts

import fs from "node:fs";
import path from "node:path";
import { toRepoRelative } from "@utils/paths";
import { buildActionName } from "@pageActionTools/page-action-generator/generator/buildActionName";
import { buildActionPath } from "@pageActionTools/page-action-generator/generator/buildActionPath";
import { loadPageObjectManifestPage } from "@pageActionTools/page-action-generator/generator/loadPageObjectManifestPage";
import type { ValidationRule } from "../../types";

export const checkPlatformIndexExports: ValidationRule = {
    category: "registry",
    name: "checkPlatformIndexExports",
    description: "Validate platform index files export all expected actions",
    run: (context) => {
        const issues = Object.keys(context.pageObjectIndex).sort().flatMap((pageKey) => {
            const page = loadPageObjectManifestPage(context.pageObjectIndex[pageKey]);
            const naming = buildActionName(page);
            const paths = buildActionPath({ page, naming });

            if (!fs.existsSync(paths.platformIndexFile)) {
                return [{
                    level: "error" as const,
                    key: pageKey,
                    message: "Missing platform index file.",
                    meta: {
                        filePath: toRepoRelative(paths.platformIndexFile),
                        expected: `export { ${naming.actionName} } ...`,
                        actual: "(missing file)",
                    },
                }];
            }

            const content = fs.readFileSync(paths.platformIndexFile, "utf8");
            const expected = `export { ${naming.actionName} } from "./${page.group}/${naming.actionFileName.replace(".ts", "")}";`;

            return content.includes(expected)
                ? []
                : [{
                    level: "error" as const,
                    key: pageKey,
                    message: "Missing expected action export in platform index file.",
                    meta: {
                        filePath: toRepoRelative(paths.platformIndexFile),
                        expected,
                        actual: "(missing export)",
                    },
                }];
        });

        return {
            category: "registry",
            name: "checkPlatformIndexExports",
            issues,
        };
    },
};
