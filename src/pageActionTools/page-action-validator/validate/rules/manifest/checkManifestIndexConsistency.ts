// src/pageActionTools/page-action-validator/validate/rules/manifest/checkManifestIndexConsistency.ts

import fs from "node:fs";
import path from "node:path";
import { toRepoRelative } from "@utils/paths";
import type { ValidationRule } from "../../types";

export const checkManifestIndexConsistency: ValidationRule = {
    category: "manifest",
    name: "checkManifestIndexConsistency",
    description: "Validate page action manifest index matches manifest entry files",
    run: (context) => {
        const manifestActionsDir = path.join(
            context.pageActionManifestDir,
            "actions"
        );

        const indexedFiles = new Set(Object.values(context.pageActionIndex));
        const actualFiles = fs.existsSync(manifestActionsDir)
            ? fs.readdirSync(manifestActionsDir).filter((file) => file.endsWith(".json"))
            : [];

        const missingEntryFiles = Object.entries(context.pageActionIndex).flatMap(
            ([pageKey, fileName]) => {
                const filePath = path.join(manifestActionsDir, fileName);

                return fs.existsSync(filePath)
                    ? []
                    : [{
                        level: "error" as const,
                        key: pageKey,
                        message: "Manifest index contains stale manifest entry reference.",
                        meta: {
                            filePath: toRepoRelative(path.join(context.pageActionManifestDir, "index.json")),
                            actual: fileName,
                            expected: "reference existing manifest entry file",
                        },
                    }];
            }
        );

        const unindexedEntryFiles = actualFiles.flatMap((fileName) => {
            if (indexedFiles.has(fileName)) {
                return [];
            }

            const filePath = path.join(manifestActionsDir, fileName);

            return [{
                level: "error" as const,
                key: fileName,
                message: "Manifest entry file exists but is not referenced in manifest index.",
                meta: {
                    filePath: toRepoRelative(filePath),
                    actual: "existing manifest entry file is not indexed",
                    expected: "add file to manifest index",
                },
            }];
        });

        return {
            category: "manifest",
            name: "checkManifestIndexConsistency",
            issues: [...missingEntryFiles, ...unindexedEntryFiles],
        };
    },
};
