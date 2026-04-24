// src/toolingLayer/businessJourneys/validator/validate/rules/source/checkJourneyPageActionReferences.ts

import fs from "node:fs";
import path from "node:path";
import {
    PAGE_ACTIONS_REGISTRY_DIR,
    toRepoRelative,
} from "@utils/paths";
import type {
    ValidationCheckResult,
    ValidationNode,
} from "../../pipeline/types";
import {
    buildJourneyRunnerFile,
    loadExpectedJourneyTargets,
} from "../journeys/shared";

const PAGE_ACTION_REF_PATTERN =
    /pageActionsRegistry\.([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/g;

function registryLeafExists(args: {
    platform: string;
    application: string;
    product: string;
    member: string;
}): boolean {
    const leafFile = path.join(
        PAGE_ACTIONS_REGISTRY_DIR,
        args.platform,
        args.application,
        `${args.product}.ts`
    );

    if (!fs.existsSync(leafFile)) {
        return false;
    }

    const content = fs.readFileSync(leafFile, "utf8");
    return content.includes(`${args.member}: actions.`);
}

export function checkJourneyPageActionReferences(): ValidationCheckResult {
    const issues: ValidationNode[] = [];

    for (const target of loadExpectedJourneyTargets()) {
        const file = buildJourneyRunnerFile(target);

        if (!fs.existsSync(file)) {
            continue;
        }

        const content = fs.readFileSync(file, "utf8");
        const matches = [...content.matchAll(PAGE_ACTION_REF_PATTERN)];

        for (const match of matches) {
            const [, platform, application, product, member] = match;

            if (
                !registryLeafExists({
                    platform,
                    application,
                    product,
                    member,
                })
            ) {
                issues.push({
                    severity: "error",
                    title: toRepoRelative(file),
                    summary: `missing pageAction registry reference: ${match[0]}`,
                });
            }
        }
    }

    return {
        id: "checkJourneyPageActionReferences",
        severity: issues.length === 0 ? "success" : "error",
        summary:
            issues.length === 0
                ? "no issues"
                : `${issues.length} invalid reference(s)`,
        nodes: issues,
    };
}
