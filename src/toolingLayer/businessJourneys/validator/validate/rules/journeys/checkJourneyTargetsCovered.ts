// src/toolingLayer/businessJourneys/validator/validate/rules/journeys/checkJourneyTargetsCovered.ts

import fs from "node:fs";
import { toRepoRelative } from "@utils/paths";
import type {
    ValidationCheckResult,
    ValidationNode,
} from "../../pipeline/types";
import {
    buildJourneyDir,
    buildTargetSegments,
    loadExpectedJourneyTargets,
} from "./shared";

export function checkJourneyTargetsCovered(): ValidationCheckResult {
    const issues: ValidationNode[] = [];

    for (const target of loadExpectedJourneyTargets()) {
        const journeyDir = buildJourneyDir(target);

        if (!fs.existsSync(journeyDir)) {
            issues.push({
                severity: "error",
                title: buildTargetSegments(target).join("/"),
                summary: `missing journey target: ${toRepoRelative(journeyDir)}`,
            });
        }
    }

    return {
        id: "checkJourneyTargetsCovered",
        severity: issues.length === 0 ? "success" : "error",
        summary:
            issues.length === 0
                ? "no issues"
                : `${issues.length} missing target(s)`,
        nodes: issues,
    };
}
