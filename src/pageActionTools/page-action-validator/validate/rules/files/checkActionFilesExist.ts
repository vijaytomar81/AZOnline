// src/pageActionTools/page-action-validator/validate/rules/files/checkActionFilesExist.ts

import fs from "node:fs";
import path from "node:path";
import type { ValidationRule } from "../../types";

export const checkActionFilesExist: ValidationRule = {
    category: "files",
    name: "checkActionFilesExist",
    description: "Validate manifest-referenced action files exist",
    run: (context) => {
        const issues = Object.entries(context.pageActionEntries).flatMap(
            ([pageKey, entry]) => {
                if (!entry?.paths?.actionFile) {
                    return [{
                        level: "error" as const,
                        key: pageKey,
                        message: "Manifest entry is missing paths.actionFile.",
                    }];
                }

                const actionExists = fs.existsSync(path.resolve(entry.paths.actionFile));

                return actionExists
                    ? []
                    : [{
                        level: "error" as const,
                        key: pageKey,
                        message: `Missing action file: ${entry.paths.actionFile}`,
                    }];
            }
        );

        return {
            category: "files",
            name: "checkActionFilesExist",
            issues,
        };
    },
};
