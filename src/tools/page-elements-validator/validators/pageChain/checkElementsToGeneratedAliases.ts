// src/tools/page-elements-validator/validators/pageChain/checkElementsToGeneratedAliases.ts

import { extractTopLevelObjectKeys } from "../shared/extractTsObjectKeys";
import { extractPageMeta } from "./pageMetaValidator";
import { buildStep } from "./types";

export function checkElementsToGeneratedAliases(params: {
    elementsKeys: string[];
    aliasesGeneratedTs: string;
    pageMapUrlPath?: string;
}) {

    const errors: string[] = [];
    const warnings: string[] = [];

    const aliasesGeneratedKeys = extractTopLevelObjectKeys(
        params.aliasesGeneratedTs,
        "aliasesGenerated"
    );

    const elSet = new Set(params.elementsKeys);
    const agSet = new Set(aliasesGeneratedKeys);

    const missing = params.elementsKeys.filter(k => !agSet.has(k));
    const extra = aliasesGeneratedKeys.filter(k => !elSet.has(k));

    if (missing.length) {
        errors.push(`aliases.generated.ts missing keys: ${missing.join(", ")}`);
    }

    if (extra.length) {
        warnings.push(`aliases.generated.ts extra keys: ${extra.join(", ")}`);
    }

    const meta = extractPageMeta(params.aliasesGeneratedTs);

    if (!meta.hasPageMeta) {
        errors.push("aliases.generated.ts missing pageMeta");
    }

    if (params.pageMapUrlPath && !meta.hasUrlPath) {
        errors.push("pageMeta missing urlPath");
    }

    if (params.pageMapUrlPath && !meta.hasUrlRe) {
        warnings.push("pageMeta missing urlRe");
    }

    return {
        aliasesGeneratedKeys,
        step: buildStep(
            "Elements → Generated Aliases",
            errors,
            warnings,
            "aliases.generated.ts matches elements.ts"
        )
    };
}