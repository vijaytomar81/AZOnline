// src/tools/pageObjects/validator/validate/rules/pageChain/checkPageObjectStructure.ts

import fs from "node:fs";

import type { ValidationRule } from "../../pipeline/types";
import { getPageArtifactPaths } from "@pageObjectCommon/pagePaths";
import { loadAllPageMaps } from "@pageObjectCommon/readPageMap";
import { buildPageObjectStructureReportNode } from "./pageObjectStructure/buildPageObjectStructureReportNode";
import { collectMissingPageObjectStructureItems } from "./pageObjectStructure/collectMissingPageObjectStructureItems";
import { formatPageObjectStructureItems } from "./pageObjectStructure/formatPageObjectStructureItems";

export const checkPageObjectStructure: ValidationRule = {
    id: "pageChain.checkPageObjectStructure",
    description: "Validate page object structure and managed alias markers",
    run(ctx) {
        const issues = [];
        const reportNodes = [];

        for (const item of loadAllPageMaps(ctx.mapsDir)) {
            const artifact = getPageArtifactPaths(
                ctx.pageObjectsDir,
                item.pageMap.pageKey
            );

            if (!fs.existsSync(artifact.pageObjectPath)) {
                continue;
            }

            const pageObjectTs = fs.readFileSync(artifact.pageObjectPath, "utf8");
            const missingItems = collectMissingPageObjectStructureItems({
                pageObjectTs,
                pageKey: item.pageMap.pageKey,
                className: artifact.className,
            });

            if (missingItems.length === 0) {
                continue;
            }

            issues.push({
                ruleId: this.id,
                severity: "ERROR" as const,
                issueLabel: "Missing",
                message: formatPageObjectStructureItems(missingItems),
                pageKey: item.pageMap.pageKey,
                filePath: artifact.pageObjectPath,
            });

            reportNodes.push(
                buildPageObjectStructureReportNode({
                    pageKey: item.pageMap.pageKey,
                    className: artifact.className,
                    missingItems,
                })
            );
        }

        return { issues, reportNodes };
    },
};
