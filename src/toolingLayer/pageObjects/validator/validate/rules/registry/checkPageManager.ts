// src/tools/pageObjects/validator/validate/rules/registry/checkPageManager.ts

import fs from "node:fs";

import type { ValidationRule } from "../../pipeline/types";
import { getPageManagerFile } from "@toolingLayer/pageObjects/common/pagePaths";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";
import { buildPageManagerExpectedState } from "./pageManager/buildPageManagerExpectedState";
import { buildPageManagerReportNodes } from "./pageManager/buildPageManagerReportNodes";
import { collectPageManagerIssues } from "./pageManager/collectPageManagerIssues";
import {
    extractPageManagerImports,
    extractPageManagerKeys,
} from "./pageManager/extractPageManagerState";
import { buildMissingPageManagerResult } from "./pageManager/missingPageManagerResult";

export const checkPageManager: ValidationRule = {
    id: "registry.checkPageManager",
    description: "Validate src/pages/pageManager.ts against actual page objects",
    run(ctx) {
        const pageManagerFile = getPageManagerFile(ctx.pageRegistryDir);

        if (!fs.existsSync(pageManagerFile)) {
            return buildMissingPageManagerResult(this.id, pageManagerFile);
        }

        const pageManagerTs = fs.readFileSync(pageManagerFile, "utf8");
        const actualImports = extractPageManagerImports(pageManagerTs);
        const actualKeyIds = extractPageManagerKeys(pageManagerTs);
        const expectedState = buildPageManagerExpectedState(
            loadAllPageMaps(ctx.mapsDir)
        );

        const grouped = collectPageManagerIssues({
            ruleId: this.id,
            filePath: pageManagerFile,
            expectedState,
            actualImports,
            actualKeyIds,
        });

        return {
            issues: grouped.issues,
            reportNodes: buildPageManagerReportNodes(grouped),
        };
    },
};