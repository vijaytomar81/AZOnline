// src/toolingLayer/pageObjects/validator/validate/rules/registry/indexExports/missingIndexFileResult.ts

export function buildMissingIndexFileResult(ruleId: string, filePath: string) {
    return {
        issues: [
            {
                ruleId,
                severity: "ERROR" as const,
                issueLabel: "Missing",
                message: "[index.ts]",
                filePath,
            },
        ],
        reportNodes: [
            {
                title: "registry",
                children: [
                    {
                        title: "index.ts",
                        children: [
                            {
                                severity: "error" as const,
                                title: "Missing",
                                summary: "[index.ts]",
                            },
                        ],
                    },
                ],
            },
        ],
    };
}
