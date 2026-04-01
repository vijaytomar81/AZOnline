// src/pageObjectTools/page-object-validator/validate/rules/hygiene/moduleHygiene/buildMissingRegistryFileResult.ts

import type { ModuleHygieneRuleResult } from "./moduleHygieneTypes";

export function buildMissingRegistryFileResult(
    ruleId: string,
    fileName: "index.ts" | "pageManager.ts",
    filePath: string
): ModuleHygieneRuleResult {
    return {
        issues: [
            {
                ruleId,
                severity: "ERROR",
                issueLabel: "Missing",
                message: `[${fileName}]`,
                filePath,
            },
        ],
        reportNode: {
            title: "registry",
            children: [
                {
                    title: fileName,
                    children: [
                        {
                            severity: "error",
                            title: "Missing",
                            summary: `[${fileName}]`,
                        },
                    ],
                },
            ],
        },
    };
}
