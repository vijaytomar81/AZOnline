// src/data/getCase.ts
import fs from "fs";
import path from "path";

export type CaseObject = Record<string, any>;

export type CasesJson = {
    sheet: string;
    sourceExcel?: string;
    generatedAt?: string;
    caseCount?: number;
    // Level-4 output: cases is array of { [scriptName]: payload }
    FlowNB?: Array<Record<string, CaseObject>>;
    [sheetName: string]: any;
};

export type LoadedCases = {
    sheetName: string;
    all: Array<{ scriptName: string; payload: CaseObject }>;
};

/**
 * Resolve a cases JSON path.
 * - If env CASES_FILE is set, uses that.
 * - Else uses src/data/generated/<sheet>.json
 */
export function resolveCasesFile(sheetName: string): string {
    const explicit = process.env.CASES_FILE;
    if (explicit && explicit.trim()) return explicit;

    return path.join(process.cwd(), "src", "data", "generated", `${sheetName}.json`);
}

export function loadCases(sheetName: string): LoadedCases {
    const filePath = resolveCasesFile(sheetName);

    if (!fs.existsSync(filePath)) {
        throw new Error(
            `Cases JSON not found: ${filePath}\n` +
            `Tip: run data-builder first to generate it.`
        );
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(raw) as CasesJson;

    // Find the array for the given sheet name (most common shape)
    const arr = (json as any)[sheetName] as Array<Record<string, CaseObject>> | undefined;
    if (!Array.isArray(arr)) {
        throw new Error(
            `Invalid cases JSON structure. Expected top-level key '${sheetName}' to be an array.\n` +
            `Found keys: ${Object.keys(json).join(", ")}`
        );
    }

    const all = arr.map((obj) => {
        const scriptName = Object.keys(obj)[0];
        const payload = obj[scriptName];
        return { scriptName, payload };
    });

    return { sheetName, all };
}

/**
 * Select cases based on env CASE:
 * - If CASE is not set => return all
 * - If CASE="DJ_GOL_NB001" => one
 * - If CASE="DJ_GOL_NB001,DJ_GOL_NB002" => many
 */
export function selectCases(sheetName: string): Array<{ scriptName: string; payload: CaseObject }> {
    const { all } = loadCases(sheetName);

    const filter = (process.env.CASE || "").trim();
    if (!filter) return all;

    const wanted = filter
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const byName = new Map(all.map((c) => [c.scriptName, c]));

    const selected: Array<{ scriptName: string; payload: CaseObject }> = [];
    const missing: string[] = [];

    for (const name of wanted) {
        const hit = byName.get(name);
        if (!hit) missing.push(name);
        else selected.push(hit);
    }

    if (missing.length) {
        throw new Error(
            `CASE selection error. These scriptName(s) were not found: ${missing.join(", ")}`
        );
    }

    return selected;
}