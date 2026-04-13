// src/toolingLayer/pageObjects/validator/validate/rules/hygiene/moduleHygiene/buildMissingRegistryFileResult.ts

import {
    VALIDATION_SEVERITIES,
    type RegistryFileName,
} from "@configLayer/tooling/validation";
import { UI_SEVERITIES } from "@configLayer/core/uiSeverities";
import type { ModuleHygieneRuleResult } from "./moduleHygieneTypes";

export function buildMissingRegistryFileResult(
    ruleId: string,
    fileName: RegistryFileName,
    filePath: string
): ModuleHygieneRuleResult {
    return {
        issues: [
            {
                ruleId,
                severity: VALIDATION_SEVERITIES.ERROR,
                issueLabel: "Missing",
                message: `[${fileName}]`,
                filePath,
            },
        ],
        reportNode: {
            title: "registry",
            children: [
                {
                    title: fileName,
                    children: [
                        {
                            severity: UI_SEVERITIES.ERROR,
                            title: "Missing",
                            summary: `[${fileName}]`,
                        },
                    ],
                },
            ],
        },
    };
}