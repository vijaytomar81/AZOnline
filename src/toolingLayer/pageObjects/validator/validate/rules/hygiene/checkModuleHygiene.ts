// src/toolingLayer/pageObjects/validator/validate/rules/hygiene/checkModuleHygiene.ts

import type { ValidationRule } from "../../pipeline/types";
import { getIndexFile, getPageManagerFile } from "@toolingLayer/pageObjects/common/pagePaths";
import { buildMissingRegistryFileResult } from "./moduleHygiene/buildMissingRegistryFileResult";
import { buildModuleHygieneReportNodes } from "./moduleHygiene/buildModuleHygieneReportNodes";
import { collectIndexModuleHygieneIssues } from "./moduleHygiene/collectIndexModuleHygieneIssues";
import { collectPageManagerModuleHygieneIssues } from "./moduleHygiene/collectPageManagerModuleHygieneIssues";
import { readRegistryModuleFile } from "./moduleHygiene/readRegistryModuleFile";

export const checkModuleHygiene: ValidationRule = {
    id: "hygiene.checkModuleHygiene",
    description: "Validate registry module hygiene and expected structure",
    run(ctx) {
        const indexFile = getIndexFile(ctx.pageRegistryDir);
        const pageManagerFile = getPageManagerFile(ctx.pageRegistryDir);

        const indexRead = readRegistryModuleFile(indexFile);
        const pageManagerRead = readRegistryModuleFile(pageManagerFile);

        if (!indexRead.exists && !pageManagerRead.exists) {
            const indexMissing = buildMissingRegistryFileResult(
                this.id,
                "index.ts",
                indexFile
            );
            const pageManagerMissing = buildMissingRegistryFileResult(
                this.id,
                "pageManager.ts",
                pageManagerFile
            );

            return {
                issues: [...indexMissing.issues, ...pageManagerMissing.issues],
                reportNodes: buildModuleHygieneReportNodes(
                    indexMissing.reportNode,
                    pageManagerMissing.reportNode
                ),
            };
        }

        const indexResult = indexRead.exists
            ? collectIndexModuleHygieneIssues(this.id, indexFile, indexRead.content)
            : buildMissingRegistryFileResult(this.id, "index.ts", indexFile);

        const pageManagerResult = pageManagerRead.exists
            ? collectPageManagerModuleHygieneIssues(
                this.id,
                pageManagerFile,
                pageManagerRead.content
            )
            : buildMissingRegistryFileResult(
                this.id,
                "pageManager.ts",
                pageManagerFile
            );

        return {
            issues: [...indexResult.issues, ...pageManagerResult.issues],
            reportNodes: buildModuleHygieneReportNodes(
                indexResult.reportNode,
                pageManagerResult.reportNode
            ),
        };
    },
};
