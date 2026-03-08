// src/data/data-builder/types.ts

import type { Logger } from "../../utils/logger";

export type ScriptIdFilter = string; // e.g. "1-10,15"

export type DataBuilderBaseArgs = {
    excelPath: string;
    sheetName: string;
    outputPath: string;
    scriptIdFilter: ScriptIdFilter;
    includeEmptyChildFields: boolean;
    verbose: boolean;
};

/**
 * One test case in a normalized, test-friendly shape.
 */
export type BuiltCase = {
    caseIndex: number;
    scriptName: string;
    scriptId?: string;
    description?: string;
    data: Record<string, any>;
};

export type CasesFile = {
    sheet: string;
    sourceExcel: string;
    generatedAt: string;
    caseCount: number;
    cases: BuiltCase[];
};

export type DataBuilderData = DataBuilderBaseArgs & {
    workbook?: any;
    sheet?: any;
    absExcel?: string;

    meta?: {
        sheet: string;
        scriptIdRow?: number;
        scriptNameRow?: number;
        caseMetas: Array<{
            col: number;
            scriptId: string;
            scriptName: string;
        }>;
    };

    casesFile?: CasesFile;
    absOut?: string;
};

export type DataBuilderContext = {
    log: Logger;
    data: DataBuilderData;
};