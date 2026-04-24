// src/toolingLayer/businessJourneys/validator/validate/rules/source/checkJourneyUsesPageActionsRegistry.ts

import fs from "node:fs";
import path from "node:path";
import {
    BUSINESS_JOURNEYS_DIR,
    toRepoRelative,
} from "@utils/paths";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";

function walk(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            return walk(fullPath);
        }

        return entry.isFile() && entry.name === "runNewBusinessJourney.ts"
            ? [fullPath]
            : [];
    });
}

export function checkJourneyUsesPageActionsRegistry(): ValidationCheckResult {
    const files = walk(BUSINESS_JOURNEYS_DIR);

    const issues: ValidationNode[] = files
        .filter((file) => {
            const content = fs.readFileSync(file, "utf8");
            return !content.includes("pageActionsRegistry");
        })
        .map((file) => ({
            severity: "error",
            title: toRepoRelative(file),
            summary: "journey does not use pageActionsRegistry",
        }));

    return {
        id: "checkJourneyUsesPageActionsRegistry",
        severity: issues.length === 0 ? "success" : "error",
        summary: issues.length === 0 ? "no issues" : `${issues.length} issue(s)`,
        nodes: issues,
    };
}
