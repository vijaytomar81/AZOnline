// src/pageActionTools/page-action-validator/validate/rules/files/checkUnexpectedActionFiles.ts

import path from "node:path";
import { toRepoRelative } from "@utils/paths";
import type { ValidationRule } from "../../types";

export const checkUnexpectedActionFiles: ValidationRule = {
    category: "files",
    name: "checkUnexpectedActionFiles",
    description: "Validate no orphan action files exist outside manifest coverage",
    run: (context) => {
        const manifestFiles = new Set(
            Object.values(context.pageActionEntries).map((entry) =>
                path.resolve(entry.paths.actionFile)
            )
        );

        const issues = context.actionFiles
            .filter((filePath) => !manifestFiles.has(path.resolve(filePath)))
            .map((filePath) => ({
                level: "warning" as const,
                message: `Unexpected action file not registered in manifest: ${toRepoRelative(filePath)}`,
            }));

        return {
            category: "files",
            name: "checkUnexpectedActionFiles",
            issues,
        };
    },
};
