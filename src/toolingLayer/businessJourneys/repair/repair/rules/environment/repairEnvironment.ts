// src/toolingLayer/businessJourneys/repair/repair/rules/environment/repairEnvironment.ts

import fs from "node:fs";
import path from "node:path";
import { BUSINESS_JOURNEYS_DIR } from "@utils/paths";
import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

export function repairEnvironment(
    _context: RepairContext
): RepairRuleResult {
    const dirs = [
        BUSINESS_JOURNEYS_DIR,
        path.join(BUSINESS_JOURNEYS_DIR, "framework"),
        path.join(BUSINESS_JOURNEYS_DIR, "runtime"),
    ];

    let created = 0;

    for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            created++;
        }
    }

    return {
        group: "environment",
        name: "repairEnvironment",
        status: created > 0 ? "created" : "unchanged",
        created: created > 0 ? 1 : 0,
        updated: 0,
        removed: 0,
        unchanged: created > 0 ? 0 : 1,
        warning: 0,
        failed: 0,
        filesCreated: 0,
        filesUpdated: 0,
        filesRemoved: 0,
        details: [],
    };
}
