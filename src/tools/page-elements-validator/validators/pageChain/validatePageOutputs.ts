// src/tools/page-elements-validator/validators/pageChain/validatePageOutputs.ts

import fs from "node:fs";
import path from "node:path";
import { safeReadJson } from "../../../../utils/fs";

import type { PageMap } from "../../../page-scanner/scanner/types";

import { pageKeyToFolder, pageKeyToPageClassFile } from "../shared/pagePaths";

import { checkPageMapToElements } from "./checkPageMapToElements";
import { checkElementsToGeneratedAliases } from "./checkElementsToGeneratedAliases";
import { checkGeneratedToBusinessAliases } from "./checkGeneratedToBusinessAliases";
import { checkBusinessAliasesToPageObject } from "./checkBusinessAliasesToPageObject";
import { checkPageObjectStructure } from "./checkPageObjectStructure";

import type { ValidateResult } from "./types";

export function validateOnePage(params: {
    mapsDir: string;
    pagesDir: string;
    mapFile: string;
}): ValidateResult {

    const mapPath = path.join(params.mapsDir, params.mapFile);
    const pageMap = safeReadJson<PageMap>(mapPath);

    if (!pageMap) {
        return {
            ok: false,
            errors: ["Unable to read page-map"],
            warnings: [],
            steps: []
        };
    }

    const folder = pageKeyToFolder(params.pagesDir, pageMap.pageKey);

    const elementsPath = path.join(folder, "elements.ts");
    const aliasesGenPath = path.join(folder, "aliases.generated.ts");
    const aliasesPath = path.join(folder, "aliases.ts");
    const pagePath = path.join(folder, pageKeyToPageClassFile(pageMap.pageKey));

    const elementsTs = fs.readFileSync(elementsPath, "utf8");
    const aliasesGenTs = fs.readFileSync(aliasesGenPath, "utf8");
    const aliasesTs = fs.readFileSync(aliasesPath, "utf8");
    const pageTs = fs.readFileSync(pagePath, "utf8");

    const pageMapKeys = Object.keys(pageMap.elements);

    const steps = [];

    const f1 = checkPageMapToElements({
        pageMapKeys,
        elementsTs
    });

    steps.push(f1.step);

    const f2 = checkElementsToGeneratedAliases({
        elementsKeys: f1.elementsKeys,
        aliasesGeneratedTs: aliasesGenTs,
        pageMapUrlPath: pageMap.urlPath
    });

    steps.push(f2.step);

    const f3 = checkGeneratedToBusinessAliases({
        aliasesGeneratedKeys: f2.aliasesGeneratedKeys,
        aliasesHumanTs: aliasesTs,
        elementKeys: f1.elementsKeys
    });

    steps.push(f3);

    const f4 = checkBusinessAliasesToPageObject({
        pageKey: pageMap.pageKey,
        aliasesGeneratedKeys: f2.aliasesGeneratedKeys,
        aliasesHumanTs: aliasesTs,
        pageObjectTs: pageTs,
        pageObjectFileName: path.basename(pagePath)
    });

    steps.push(f4);

    const f5 = checkPageObjectStructure({
        pageObjectTs: pageTs,
        pageKey: pageMap.pageKey,
        pageObjectFileName: path.basename(pagePath)
    });

    steps.push(f5);

    const errors: string[] = [];
    const warnings: string[] = [];

    for (const s of steps) {
        if (s.status === "FAIL") errors.push(...s.messages);
        if (s.status === "WARN") warnings.push(...s.messages);
    }

    return {
        ok: errors.length === 0,
        errors,
        warnings,
        steps
    };
}