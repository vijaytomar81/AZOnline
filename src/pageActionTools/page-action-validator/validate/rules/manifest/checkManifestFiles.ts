// src/pageActionTools/page-action-validator/validate/rules/manifest/checkManifestFiles.ts

import fs from "node:fs";
import path from "node:path";
import type { ValidationRule } from "../../types";

export const checkManifestFiles: ValidationRule = {
    category: "manifest",
    name: "checkManifestFiles",
    description: "Validate manifest file paths point to real files",
    run: (context) => {
        const issues = Object.entries(context.pageActionEntries).flatMap(
            ([pageKey, entry]) => {
                const items: Array<[string, string]> = [
                    ["actionFile", entry.paths.actionFile],
                    ["indexFile", entry.paths.indexFile],
                    ["sourcePageObjectFile", entry.paths.sourcePageObjectFile],
                ];

                return items.flatMap(([label, filePath]) =>
                    fs.existsSync(path.resolve(filePath))
                        ? []
                        : [{
                            level: "error" as const,
                            message: `Manifest path missing for ${pageKey} -> ${label}: ${filePath}`,
                        }]
                );
            }
        );

        return {
            category: "manifest",
            name: "checkManifestFiles",
            issues,
        };
    },
};
