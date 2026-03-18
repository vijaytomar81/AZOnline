// src/data/getCase.ts
import fs from "node:fs";
import path from "node:path";
import type { CasesFile, BuiltCase } from "./data-builder/types";

export type CaseObject = Record<string, any>;

export function resolveCasesFile(sheetName: string): string {
    const explicit = process.env.CASES_FILE;
    if (explicit && explicit.trim()) return explicit;
    return path.join(process.cwd(), "src", "data", "generated", `${sheetName}.json`);
}

export function loadCases(sheetName: string): Array<{ scriptName: string; payload: CaseObject }> {
    const filePath = resolveCasesFile(sheetName);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Cases JSON not found: ${filePath}\nTip: run data-builder first.`);
    }

    const json = JSON.parse(fs.readFileSync(filePath, "utf-8")) as CasesFile;
    if (!Array.isArray(json.cases)) {
        throw new Error(`Invalid cases JSON structure. Expected "cases" array in ${filePath}`);
    }

    return json.cases.map((c: BuiltCase) => ({
        scriptName: c.scriptName,
        payload: c.data,
    }));
}

export function selectCases(sheetName: string): Array<{ scriptName: string; payload: CaseObject }> {
    const all = loadCases(sheetName);
    const filter = String(process.env.CASE ?? "").trim();
    if (!filter) return all;

    const wanted = filter.split(",").map((s) => s.trim()).filter(Boolean);
    const byName = new Map(all.map((c) => [c.scriptName, c]));
    const missing: string[] = [];

    const selected = wanted.flatMap((name) => {
        const hit = byName.get(name);
        if (!hit) missing.push(name);
        return hit ? [hit] : [];
    });

    if (missing.length) {
        throw new Error(`CASE selection error. Missing scriptName(s): ${missing.join(", ")}`);
    }

    return selected;
}