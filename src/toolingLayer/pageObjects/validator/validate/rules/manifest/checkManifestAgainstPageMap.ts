// src/tools/pageObjects/validator/validate/rules/manifest/checkManifestAgainstPageMap.ts

import { loadPageManifest } from "@toolingLayer/pageObjects/generator/generator/pageManifest";
import type { ValidationRule } from "../../pipeline/types";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";
import { buildExtraManifestIssueEntries } from "./manifestAgainstPageMap/buildExtraManifestIssueEntries";
import { buildManifestComparisonInputs } from "./manifestAgainstPageMap/buildManifestComparisonInputs";
import { buildManifestComparisonResult } from "./manifestAgainstPageMap/buildManifestComparisonResult";

export const checkManifestAgainstPageMap: ValidationRule = {
    id: "manifest.checkManifestAgainstPageMap",
    description: "Validate manifest entries against page-map content",
    run(ctx) {
        const manifest = loadPageManifest(ctx.manifestFile);
        const pageMaps = loadAllPageMaps(ctx.mapsDir);
        const validPageKeys = new Set<string>();
        const issues = [];
        const reportNodes = [];

        for (const item of pageMaps) {
            validPageKeys.add(item.pageMap.pageKey);

            const result = buildManifestComparisonResult(
                buildManifestComparisonInputs({
                    pageMapItem: item,
                    manifestEntry: manifest.pages[item.pageMap.pageKey],
                    pageObjectsDir: ctx.pageObjectsDir,
                    manifestFile: ctx.manifestFile,
                    ruleId: this.id,
                })
            );

            issues.push(...result.issues);
            if (result.reportNode) {
                reportNodes.push(result.reportNode);
            }
        }

        const extraEntries = buildExtraManifestIssueEntries({
            manifestPages: manifest.pages,
            validPageKeys,
            manifestFile: ctx.manifestFile,
            ruleId: this.id,
        });

        issues.push(...extraEntries.issues);
        reportNodes.push(...extraEntries.reportNodes);

        return { issues, reportNodes };
    },
};
