// src/toolingLayer/businessJourneys/validator/validate/rules/source/checkJourneyUsesPageActionsRegistry.ts

import fs from "node:fs";
import { toRepoRelative } from "@utils/paths";
import type {
    ValidationCheckResult,
    ValidationNode,
} from "../../pipeline/types";
import {
    buildJourneyRunnerFile,
    loadExpectedJourneyTargets,
} from "../journeys/shared";

export function checkJourneyUsesPageActionsRegistry(): ValidationCheckResult {
    const issues: ValidationNode[] = [];

    for (const target of loadExpectedJourneyTargets()) {
        const file = buildJourneyRunnerFile(target);

        if (!fs.existsSync(file)) {
            continue;
        }

        const content = fs.readFileSync(file, "utf8");

        if (!content.includes("pageActionsRegistry")) {
            issues.push({
                severity: "error",
                title: toRepoRelative(file),
                summary: "journey does not use pageActionsRegistry",
            });
        }
    }

    return {
        id: "checkJourneyUsesPageActionsRegistry",
        severity: issues.length === 0 ? "success" : "error",
        summary: issues.length === 0 ? "no issues" : `${issues.length} issue(s)`,
        nodes: issues,
    };
}
