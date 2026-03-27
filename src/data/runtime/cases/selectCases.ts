// src/data/runtime/cases/selectCases.ts

import { DataBuilderError } from "../../builder/errors";
import { loadCases, CaseObject } from "./loadCases";

export function selectCases(
    sheetName: string,
    schemaName?: string
): Array<{ scriptName: string; payload: CaseObject }> {
    const all = loadCases(sheetName, schemaName);
    const filter = String(process.env.CASE ?? "").trim();

    if (!filter) {
        return all;
    }

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
            source: "selectCases",
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