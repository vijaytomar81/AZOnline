// src/toolingLayer/pageActions/repair/repair/rules/environment/repairEnvironment.ts

import fs from "node:fs";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
} from "@utils/paths";
import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

export function repairEnvironment(
    _context: RepairContext
): RepairRuleResult {
    const requiredDirs = [
        PAGE_ACTIONS_ACTIONS_DIR,
        PAGE_ACTIONS_MANIFEST_DIR,
    ];

    let changedFiles = 0;

    requiredDirs.forEach((dirPath) => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            changedFiles++;
        }
    });

    return {
        group: "environment",
        name: "repairEnvironment",
        status: changedFiles > 0 ? "repaired" : "unchanged",
        changedFiles,
        repairedItems: changedFiles,
        warnings: 0,
        errors: 0,
        details: [],
    };
}
