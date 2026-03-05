// src/page-elements-validator/validators/aliasCoverage.ts

export type AliasCoverageResult = {
    errors: string[];
    warnings: string[];
};

function stripLineComments(ts: string) {
    return ts.replace(/\/\/.*$/gm, "");
}

/**
 * Extract the `{ ... }` body of:
 *   export const aliases = { ... } ...
 *
 * Supports:
 *  - } as Record<string, ElementKey>;
 *  - } as const satisfies Record<string, ElementKey>;
 *  - } as const;
 *
 * Uses a small brace-matching scan instead of brittle regex.
 */
function extractAliasesObjectBody(ts: string): string | null {
    const cleaned = stripLineComments(ts);
    const anchor = cleaned.indexOf("export const aliases");
    if (anchor < 0) return null;

    const braceStart = cleaned.indexOf("{", anchor);
    if (braceStart < 0) return null;

    let depth = 0;
    for (let i = braceStart; i < cleaned.length; i++) {
        const ch = cleaned[i];
        if (ch === "{") depth++;
        if (ch === "}") {
            depth--;
            if (depth === 0) {
                // body excludes outer braces
                return cleaned.slice(braceStart + 1, i);
            }
        }
    }
    return null;
}

export function extractAliasesHumanTargets(aliasesHumanTs: string): Set<string> {
    const targets = new Set<string>();
    const cleaned = stripLineComments(aliasesHumanTs);

    // aliasesGenerated.<ElementKey>
    const re = /\baliasesGenerated\.([A-Za-z_$][A-Za-z0-9_$]*)\b/g;

    let m: RegExpExecArray | null;
    while ((m = re.exec(cleaned))) {
        if (m[1]) targets.add(m[1]);
    }

    return targets;
}

export function extractAliasesHumanKeys(aliasesHumanTs: string): Set<string> {
    const keys = new Set<string>();

    const body = extractAliasesObjectBody(aliasesHumanTs);
    if (!body) return keys;

    // `foo:` OR `"foo-bar":`
    const keyRe = /^\s*([A-Za-z_$][A-Za-z0-9_$]*|"[^"]+"|'[^']+')\s*:/gm;

    let m: RegExpExecArray | null;
    while ((m = keyRe.exec(body))) {
        let k = m[1] ?? "";
        if (
            (k.startsWith('"') && k.endsWith('"')) ||
            (k.startsWith("'") && k.endsWith("'"))
        ) {
            k = k.slice(1, -1);
        }
        if (k) keys.add(k);
    }

    return keys;
}

export function extractAliasesUsedInPageObject(pageTs: string): Set<string> {
    const used = new Set<string>();

    // Detect all the alias wrapper calls in page object region
    // e.g. this.clickAlias("x"), this.fillAlias("y", ...), this.setCheckedAlias("z", ...)
    const re =
        /\b(clickAlias|fillAlias|selectOptionAlias|setCheckedAlias)\(\s*["'`](.+?)["'`]/g;

    let m: RegExpExecArray | null;
    while ((m = re.exec(pageTs))) {
        const alias = (m[2] ?? "").trim();
        if (alias) used.add(alias);
    }

    return used;
}

/**
 * Validates:
 * 1) Which generated element keys are not yet covered by aliases.ts mapping (RHS coverage).
 * 2) Which aliases.ts keys are not used in the page object.
 * 3) Which aliases are used in page object but not present in aliases.ts.
 */
export function validateAliasCoverage(params: {
    pageKey: string;
    aliasesGeneratedKeys: string[];
    aliasesHumanTs: string;
    pageObjectTs: string;
    pageObjectFileName: string;
}): AliasCoverageResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const aliasTargetsCovered = extractAliasesHumanTargets(params.aliasesHumanTs);
    const missingTargets = params.aliasesGeneratedKeys.filter(
        (k) => !aliasTargetsCovered.has(k)
    );

    if (missingTargets.length) {
        warnings.push(
            `aliases.ts: missing mappings for generated element keys (add entries pointing to aliasesGenerated.*): ${missingTargets.join(
                ", "
            )}`
        );
    }

    const aliasKeys = extractAliasesHumanKeys(params.aliasesHumanTs);
    const usedAliases = extractAliasesUsedInPageObject(params.pageObjectTs);

    const unusedAliases = [...aliasKeys].filter((a) => !usedAliases.has(a));
    if (unusedAliases.length) {
        warnings.push(
            `aliases.ts: aliases not used in ${params.pageObjectFileName}: ${unusedAliases.join(
                ", "
            )}`
        );
    }

    const unknownUsed = [...usedAliases].filter((a) => !aliasKeys.has(a));
    if (unknownUsed.length) {
        errors.push(
            `${params.pageObjectFileName} uses alias(es) not defined in aliases.ts: ${unknownUsed.join(
                ", "
            )}`
        );
    }

    return { errors, warnings };
}