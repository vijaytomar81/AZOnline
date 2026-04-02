// src/pageObjectTools/page-object-validator/validate/rules/registry/checkIndexExports.ts

import fs from "node:fs";

import type { ValidationRule } from "../../pipeline/types";
import { getIndexFile } from "../../../../page-object-common/pagePaths";
import { loadAllPageMaps } from "../../../../page-object-common/readPageMap";
import { buildIndexExportExpectedState } from "./indexExports/buildIndexExportExpectedState";
import { buildIndexExportReportNodes } from "./indexExports/buildIndexExportReportNodes";
import { collectIndexExportIssues } from "./indexExports/collectIndexExportIssues";
import { extractIndexExportPaths } from "./indexExports/extractIndexExportPaths";
import { buildMissingIndexFileResult } from "./indexExports/missingIndexFileResult";

export const checkIndexExports: ValidationRule = {
    id: "registry.checkIndexExports",
    description: "Validate src/pages/index.ts exports all actual page objects",
    run(ctx) {
        const indexFile = getIndexFile(ctx.pageRegistryDir);

        if (!fs.existsSync(indexFile)) {
            return buildMissingIndexFileResult(this.id, indexFile);
        }

        const indexTs = fs.readFileSync(indexFile, "utf8");
        const actualExportPaths = extractIndexExportPaths(indexTs);
        const expectedState = buildIndexExportExpectedState(
            loadAllPageMaps(ctx.mapsDir)
        );

        const grouped = collectIndexExportIssues({
            ruleId: this.id,
            filePath: indexFile,
            actualExportPaths,
            expectedState,
        });

        return {
            issues: grouped.issues,
            reportNodes: buildIndexExportReportNodes(grouped),
        };
    },
};
