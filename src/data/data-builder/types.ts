// src/data/data-builder/types.ts
import type { Logger } from "../../utils/logger";

export type ScriptIdFilter = string;

export type DataBuilderBaseArgs = {
    excelPath: string;
    sheetName: string;
    schemaName: string;
    outputPath: string;
    scriptIdFilter: ScriptIdFilter;
    excludeEmptyFields: boolean;
    strictValidation: boolean;
    verbose: boolean;
};

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

export type ValidationReport = {
    schemaName: string;
    sheetName: string;
    mode: "normal" | "strict";

    errors: string[];
    warnings: string[];
    info: string[];

    schemaToExcel: {
        requiredMissing: string[];
        mappedMissing: string[];
    };

    excelToSchema: {
        unmappedFields: string[];
    };

    summary: {
        errorCount: number;
        warningCount: number;
        requiredMissingCount: number;
        mappedMissingCount: number;
        unmappedFieldCount: number;
    };
};

export type DataBuilderData = DataBuilderBaseArgs & {
    workbook?: any;
    sheet?: any;
    absExcel?: string;
    meta?: {
        sheet: string;
        scriptIdRow?: number;
        scriptNameRow?: number;
        fieldCol: number;
        caseStartCol: number;
        dataStartRow: number;
        caseMetas: Array<{
            col: number;
            scriptId: string;
            scriptName: string;
        }>;
    };
    casesFile?: CasesFile;
    validationReport?: ValidationReport;
    absOut?: string;
};

export type DataBuilderContext = {
    log: Logger;
    data: DataBuilderData;
};