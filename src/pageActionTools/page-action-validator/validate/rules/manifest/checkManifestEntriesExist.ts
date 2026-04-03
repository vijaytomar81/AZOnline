// src/pageActionTools/page-action-validator/validate/rules/manifest/checkManifestEntriesExist.ts

import fs from "node:fs";
import path from "node:path";
import type { ValidationRule } from "../../types";

export const checkManifestEntriesExist: ValidationRule = {
    category: "manifest",
    name: "checkManifestEntriesExist",
    description: "Validate page action manifest index points to real entry files",
    run: (context) => {
        const issues = Object.entries(context.pageActionIndex).flatMap(
            ([pageKey, fileName]) => {
                const filePath = path.join(
                    context.pageActionManifestDir,
                    "actions",
                    fileName
                );
                return fs.existsSync(filePath)
                    ? []
                    : [{
                        level: "error" as const,
                        message: `Missing manifest entry file for ${pageKey}: ${fileName}`,
                    }];
            }
        );

        return {
            category: "manifest",
            name: "checkManifestEntriesExist",
            issues,
        };
    },
};
