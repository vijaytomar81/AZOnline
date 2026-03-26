// src/data/runtime/getCase.ts

import type { CasesFile, BuiltCase } from "../builder/types";
import { DataBuilderError } from "../builder/errors";
import { getCasesFile, resolveCasesFilePath } from "./getCasesFile";

export type CaseObject = Record<string, any>;

export function resolveCasesFile(sheetName: string, schemaName?: string): string {
    return resolveCasesFilePath(sheetName, schemaName);
}

export function loadCases(
    sheetName: string,
    schemaName?: string
): Array<{ scriptName: string; payload: CaseObject }> {
    const filePath = resolveCasesFile(sheetName, schemaName);
    const json = getCasesFile(sheetName, schemaName) as CasesFile;

    if (!Array.isArray(json.cases)) {
        throw new DataBuilderError({
            code: "INVALID_CASES_JSON",
            stage: "load-cases-file",
            source: "getCase",
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

export function selectCases(
    sheetName: string,
    schemaName?: string
): Array<{ scriptName: string; payload: CaseObject }> {
    const all = loadCases(sheetName, schemaName);
    const filter = String(process.env.CASE ?? "").trim();
    if (!filter) return all;

    const wanted = filter
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const byName = new Map(all.map((c) => [c.scriptName, c]));
    const missing: string[] = [];

    const selected = wanted.flatMap((name) => {
        const hit = byName.get(name);
        if (!hit) missing.push(name);
        return hit ? [hit] : [];
    });

    if (missing.length) {
        throw new DataBuilderError({
            code: "CASE_SELECTION_ERROR",
            stage: "select-cases",
            source: "getCase",
            message: `CASE selection error. Missing scriptName(s): ${missing.join(", ")}`,
            context: {
                sheetName,
                schemaName: schemaName ?? "",
                requestedCases: wanted.join(", "),
                missingCases: missing.join(", "),
            },
        });
    }

    return selected;
}