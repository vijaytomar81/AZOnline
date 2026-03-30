// src/dataLayer/runtime/cases/loadCases.ts

import type { CasesFile, BuiltCase } from "../../builder/types";
import { DataBuilderError } from "../../builder/errors";
import { getCasesFile } from "./getCasesFile";
import { resolveCasesFilePath } from "./resolveCasesFilePath";

export type CaseObject = Record<string, any>;

export function loadCases(
    sheetName: string,
    schemaName?: string
): Array<{ scriptName: string; payload: CaseObject }> {
    const filePath = resolveCasesFilePath(sheetName, schemaName);
    const json = getCasesFile(sheetName, schemaName) as CasesFile;

    if (!Array.isArray(json.cases)) {
        throw new DataBuilderError({
            code: "INVALID_CASES_JSON",
            stage: "load-cases-file",
            source: "loadCases",
            message: `Invalid cases JSON structure. Expected "cases" array in ${filePath}`,
            context: {
                sheetName,
                schemaName: schemaName ?? "",
                filePath,
            },
        });
    }

    return json.cases.map((c: BuiltCase) => ({
        scriptName: c.scriptName,
        payload: c.data,
    }));
}