// src/data/builder/core/filterScriptIds/applyScriptIdFilter.ts

import type { CasesFile } from "../../types";

export function applyScriptIdFilter(
    casesFile: CasesFile,
    allowed: Set<string>
): { before: number; filteredIds: Set<string> } {
    const before = casesFile.cases.length;

    casesFile.cases = casesFile.cases.filter((item) =>
        allowed.has(String(item.scriptId ?? "").trim())
    );

    casesFile.caseCount = casesFile.cases.length;

    return {
        before,
        filteredIds: new Set(
            casesFile.cases.map((item) => String(item.scriptId ?? "").trim())
        ),
    };
}