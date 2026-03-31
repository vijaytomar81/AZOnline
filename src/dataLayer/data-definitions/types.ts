// src/dataLayer/data-definitions/types.ts

export type ExcelColumnName = string;

export type DataDefinitionGroup =
    | "newBusiness"
    | "mta"
    | "mtc"
    | "renewal";

export type FieldMapping = Record<string, ExcelColumnName>;

export interface SchemaGroupMap {
    [key: string]: FieldMapping | SchemaGroupMap;
}

export type RepeatedGroup = {
    countField: ExcelColumnName;
    prefixBase: string;
    max: number;
    groups: SchemaGroupMap;
};

export type RepeatedGroups = Record<string, RepeatedGroup>;

export type DataSchema = {
    sheetName: string;
    outputFile: string;
    dataDefinitionGroup: DataDefinitionGroup;
    groups: SchemaGroupMap;
    repeatedGroups?: RepeatedGroups;
    requiredFields?: ExcelColumnName[];
    optionalFields?: ExcelColumnName[];
};

export type RegisteredSchema = {
    name: string;
    schema: DataSchema;
    description?: string;
    sheetAliases?: string[];
};