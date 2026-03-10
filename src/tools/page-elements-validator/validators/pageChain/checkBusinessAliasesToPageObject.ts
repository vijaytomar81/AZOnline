// src/tools/page-elements-validator/validators/pageChain/checkBusinessAliasesToPageObject.ts

import { validateAliasCoverage } from "./aliasCoverage";
import { buildStep } from "./types";

export function checkBusinessAliasesToPageObject(params: {
    pageKey: string;
    aliasesGeneratedKeys: string[];
    aliasesHumanTs: string;
    pageObjectTs: string;
    pageObjectFileName: string;
}) {

    const errors: string[] = [];
    const warnings: string[] = [];

    const cov = validateAliasCoverage({
        pageKey: params.pageKey,
        aliasesGeneratedKeys: params.aliasesGeneratedKeys,
        aliasesHumanTs: params.aliasesHumanTs,
        pageObjectTs: params.pageObjectTs,
        pageObjectFileName: params.pageObjectFileName
    });

    errors.push(...cov.errors);

    for (const w of cov.warnings) {
        if (w.includes("not used")) {
            warnings.push(w);
        }
    }

    return buildStep(
        "Business Aliases → Page Object",
        errors,
        warnings,
        `${params.pageObjectFileName} alias usage ok`
    );
}