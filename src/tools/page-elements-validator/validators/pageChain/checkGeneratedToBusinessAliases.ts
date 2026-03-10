// src/tools/page-elements-validator/validators/pageChain/checkGeneratedToBusinessAliases.ts

import { checkAliasesHumanPointers } from "./aliasPointerValidator";
import { extractAliasesHumanTargets } from "./aliasCoverage";
import { buildStep } from "./types";

export function checkGeneratedToBusinessAliases(params: {
    aliasesGeneratedKeys: string[];
    aliasesHumanTs: string;
    elementKeys: string[];
}) {

    const errors: string[] = [];
    const warnings: string[] = [];

    const pointerCheck = checkAliasesHumanPointers(
        params.aliasesHumanTs,
        new Set(params.elementKeys)
    );

    errors.push(...pointerCheck.errors);
    warnings.push(...pointerCheck.warnings);

    const targets = extractAliasesHumanTargets(params.aliasesHumanTs);

    const missing = params.aliasesGeneratedKeys.filter(
        k => !targets.has(k)
    );

    if (missing.length) {
        warnings.push(
            `aliases.ts missing mappings: ${missing.join(", ")}`
        );
    }

    return buildStep(
        "Generated Aliases → Business Aliases",
        errors,
        warnings,
        "aliases.ts mappings valid"
    );
}