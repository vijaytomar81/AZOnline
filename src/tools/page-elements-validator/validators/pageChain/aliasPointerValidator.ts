// src/tools/page-elements-validator/validators/pageChain/aliasPointerValidator.ts

import { stripLineComments } from "../../../../utils/text";

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
                return cleaned.slice(braceStart + 1, i);
            }
        }
    }

    return null;
}

export function checkAliasesHumanPointers(
    aliasesHumanTs: string,
    elementKeys: Set<string>
) {
    const errors: string[] = [];
    const warnings: string[] = [];

    const body = extractAliasesObjectBody(aliasesHumanTs);

    if (!body) {
        warnings.push(`aliases.ts: could not parse aliases object`);
        return { errors, warnings };
    }

    const cleaned = stripLineComments(body);

    const pairRe =
        /^\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*([^,]+)\s*,?\s*$/gm;

    let m: RegExpExecArray | null;

    while ((m = pairRe.exec(cleaned))) {
        const aliasKey = m[1]?.trim();
        const rhs = m[2]?.trim() ?? "";

        if (!aliasKey) continue;

        const ag = rhs.match(
            /^aliasesGenerated\.([A-Za-z_$][A-Za-z0-9_$]*)$/
        );

        if (ag) {
            const target = ag[1]!;

            if (!elementKeys.has(target)) {
                errors.push(
                    `aliases.ts: alias "${aliasKey}" points to unknown element "${target}".`
                );
            }

            continue;
        }

        const lit = rhs.match(/^"([^"]+)"$/);

        if (lit) {
            const target = lit[1]!;

            if (!elementKeys.has(target)) {
                errors.push(
                    `aliases.ts: alias "${aliasKey}" points to invalid ElementKey "${target}".`
                );
            }

            continue;
        }

        warnings.push(
            `aliases.ts: alias "${aliasKey}" value not recognized (${rhs}).`
        );
    }

    return { errors, warnings };
}