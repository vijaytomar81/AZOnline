// src/toolingLayer/pageActions/repair/repair/rules/actions/repairMissingActionFiles.ts

import fs from "node:fs";
import {
    loadPageObjectManifestIndex,
    loadPageObjectManifestPage,
    buildExpectedActionState,
    writeIfChanged,
} from "@toolingLayer/pageActions/common";
import { buildActionName } from "@toolingLayer/pageActions/generator/core/action/buildActionName";
import { renderPageActionFile } from "@toolingLayer/pageActions/generator/core/action/renderPageActionFile";
import { extractPageObjectMethods } from "@toolingLayer/pageActions/generator/core/action/extractPageObjectMethods";
import { classifyPageObjectMethods } from "@toolingLayer/pageActions/generator/core/action/classifyPageObjectMethods";
import { readPageObjectFile } from "@toolingLayer/pageActions/generator/core/action/readPageObjectFile";
import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

export function repairMissingActionFiles(
    _context: RepairContext
): RepairRuleResult {
    const index = loadPageObjectManifestIndex();

    let changedFiles = 0;
    let repairedItems = 0;

    Object.values(index.pages).forEach((relativePath) => {
        const page = loadPageObjectManifestPage(relativePath);
        const expected = buildExpectedActionState(page);

        if (fs.existsSync(expected.actionFilePath)) {
            return;
        }

        const source = readPageObjectFile(page.paths.pageObjectFile);
        const methods = extractPageObjectMethods(source);
        const classified = classifyPageObjectMethods(methods);
        const naming = buildActionName(page);

        const content = renderPageActionFile({
            page,
            naming,
            classified,
            actionFilePath: expected.actionFilePath,
        });

        const write = writeIfChanged(
            expected.actionFilePath,
            content
        );

        if (write.changed) {
            changedFiles++;
            repairedItems++;
        }
    });

    return {
        group: "actions",
        name: "repairMissingActionFiles",
        status: changedFiles > 0 ? "repaired" : "unchanged",
        changedFiles,
        repairedItems,
        warnings: 0,
        errors: 0,
        details: [],
    };
}
