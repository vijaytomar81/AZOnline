// src/dataLayer/builder/core/sheetLayoutConfig.ts

export type SheetLayoutConfig = {
    headerRow: number;

    sectionHeaderAliases: string[];
    fieldHeaderAliases: string[];
    appFieldHeaderAliases: string[];
    valueHeaderAliases: string[];

    metaFieldAliases: {
        scriptId: string[];
        scriptName: string[];
        description: string[];
        result: string[];
    };
};

export const defaultSheetLayoutConfig: SheetLayoutConfig = {
    headerRow: 1,

    sectionHeaderAliases: ["Section"],
    fieldHeaderAliases: ["StandardFieldName"],
    appFieldHeaderAliases: ["ApplicationFieldName"],
    valueHeaderAliases: ["Value"],

    metaFieldAliases: {
        scriptId: ["ScriptId", "Script ID"],
        scriptName: ["ScriptName", "Script Name"],
        description: ["Description"],
        result: ["Result"],
    },
};