// src/dataLayer/builder/app/buildFailureContext.ts

import { getArg, hasFlag, normalizeArgv } from "@utils/argv";

export type FailureContext = {
    excelPath: string;
    sheetName: string;
    schemaName: string;
    outputPath: string;
    scriptIdFilter: string;
    excludeEmptyFields: string;
    strictValidation: string;
    verbose: string;
};

function parseBoolean(value?: string): boolean {
    return ["true", "1", "yes", "y"].includes(
        String(value ?? "").toLowerCase()
    );
}

export function buildRawFailureContext(): FailureContext {
    const argv = normalizeArgv(process.argv.slice(2));

    const excelPath = String(
        getArg(argv, "--excel") ?? process.env.EXCEL_PATH ?? ""
    ).trim();
    const sheetName = String(
        getArg(argv, "--sheet") ?? process.env.SHEET ?? ""
    ).trim();
    const schemaName = String(
        getArg(argv, "--schema") ?? process.env.SCHEMA ?? ""
    ).trim();
    const outputPath = String(
        getArg(argv, "--out") ?? process.env.OUT_PATH ?? ""
    ).trim();
    const scriptIdFilter = String(
        getArg(argv, "--ids") ?? process.env.SCRIPT_IDS ?? ""
    ).trim();

    const excludeEmptyFields =
        hasFlag(argv, "--excludeEmptyFields") ||
        parseBoolean(process.env.EXCLUDE_EMPTY_FIELDS);

    const strictValidation =
        hasFlag(argv, "--strictValidation") ||
        parseBoolean(process.env.STRICT_VALIDATION);

    const verbose =
        hasFlag(argv, "--verbose") || parseBoolean(process.env.VERBOSE);

    return {
        excelPath: excelPath || "(not resolved)",
        sheetName: sheetName || "(not resolved)",
        schemaName: schemaName || "(not resolved)",
        outputPath: outputPath || "(not resolved)",
        scriptIdFilter: scriptIdFilter || "(all)",
        excludeEmptyFields: String(excludeEmptyFields),
        strictValidation: String(strictValidation),
        verbose: String(verbose),
    };
}