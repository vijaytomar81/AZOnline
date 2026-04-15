// src/dataLayer/builder/types.ts

import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";

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

    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
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

export type SectionFieldGroup = {
    requiredFields: string[];
    schemaMappingFields: string[];
};

export type ValidationReport = {
    schemaName: string;
    sheetName: string;
    mode: "normal" | "strict";
    generatedAt: string;
    reportPath?: string;
    errors: string[];
    missingSchemaFieldsInExcel: {
        requiredFields: string[];
        bySection: Record<string, SectionFieldGroup>;
    };
    missingExcelFieldsInSchema: {
        unusedExcelFields: string[];
    };
    summary: {
        errorCount: number;
        missingSchemaFieldsInExcelCount: number;
        missingExcelFieldsInSchemaCount: number;
    };
};

export type CaseMeta = {
    col?: number;
    row?: number;
    scriptId: string;
    scriptName: string;
};

export type DataBuilderMeta = {
    sheet: string;
    layout: "vertical" | "tabular";
    scriptIdRow?: number;
    scriptNameRow?: number;
    fieldCol?: number;
    caseStartCol?: number;
    dataStartRow: number;
    caseMetas: CaseMeta[];
    tabularHeaders?: string[];
};

export type DataBuilderData = DataBuilderBaseArgs & {
    workbook?: any;
    sheet?: any;
    absExcel?: string;
    meta?: DataBuilderMeta;
    casesFile?: CasesFile;
    validationReport?: ValidationReport;
    absOut?: string;
};

export type DataBuilderContext = {
    logScope: string;
    data: DataBuilderData;
};
