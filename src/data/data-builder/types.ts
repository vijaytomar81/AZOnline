// src/data/data-builder/types.ts

export type ScriptIdFilter = string; // e.g. "1-10,15"

export type DataBuilderBaseArgs = {
    excelPath: string;                // required
    sheetName: string;                // required
    outputPath: string;               // optional-ish (can be folder or file)
    scriptIdFilter: ScriptIdFilter;   // optional ("" means no filter)
    includeEmptyChildFields: boolean; // optional
    verbose: boolean;                 // optional
};

/**
 * One test case in a normalized, test-friendly shape.
 */
export type BuiltCase = {
    caseIndex: number;         // 1-based index from the sheet
    scriptName: string;        // e.g. DJ_GOL_NB001 (recommended unique key)
    scriptId?: string;         // if you have it
    description?: string;      // optional
    data: Record<string, any>; // the full payload for the test
};

export type CasesFile = {
    sheet: string;
    sourceExcel: string;
    generatedAt: string; // ISO string
    caseCount: number;
    cases: BuiltCase[];
};

export type Logger = {
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
    debug?: (msg: string) => void; // only emits in verbose mode
};

export type DataBuilderData = DataBuilderBaseArgs & {
    // produced by excel loader
    workbook?: any; // ExcelJS.Workbook
    sheet?: any;    // ExcelJS.Worksheet
    absExcel?: string;

    // produced by meta extractor
    meta?: {
        sheet: string;
        scriptIdRow?: number;
        scriptNameRow?: number;

        // Needed for building cases
        caseMetas: Array<{
            col: number;        // Excel column index for this case
            scriptId: string;   // value from Script ID row (for this column)
            scriptName: string; // value from ScriptName row (for this column)
        }>;
    };

    // produced by build-cases
    casesFile?: CasesFile; // ✅ NEW: final normalized structure (used by filters + writer)

    // produced by JSON writer
    absOut?: string;
};

export type DataBuilderContext = {
    log: Logger;
    data: DataBuilderData;
};