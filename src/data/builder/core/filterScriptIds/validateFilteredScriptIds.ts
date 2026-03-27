// src/data/builder/core/filterScriptIds/validateFilteredScriptIds.ts

import type { CasesFile } from "../../types";
import { DataBuilderError } from "../../errors";

export function validateFilteredScriptIds(args: {
    allowed: Set<string>;
    found: Set<string>;
    casesFile: CasesFile;
}): void {
    const { allowed, found, casesFile } = args;

    for (const requestedId of allowed) {
        if (found.has(requestedId)) {
            continue;
        }

        throw new DataBuilderError({
            code: "SCRIPT_ID_NOT_FOUND",
            stage: "filter-scriptIds",
            source: "validateFilteredScriptIds",
            message: `Requested scriptId "${requestedId}" not found in sheet.`,
            context: {
                requestedId,
                availableIds: casesFile.cases.map((item) => item.scriptId).join(", "),
            },
        });
    }
}