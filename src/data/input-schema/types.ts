// src/data/input-schema/types.ts

export type ExcelColumnName = string;

/**
 * Leaf node:
 * canonical JSON key -> Excel column name
 *
 * Example:
 * {
 *   firstName: "Firstname",
 *   lastName: "Lastname"
 * }
 */
export type FieldMapping = Record<string, ExcelColumnName>;

/**
 * Counted repeated section such as claims / convictions
 *
 * Example:
 * {
 *   countField: "ClaimsCount",
 *   enableField: "HadClaimsAnswer",
 *   claimDetails: {
 *     claim1: {
 *       date: "Claim1Date",
 *       reason: "Claim1Reason"
 *     }
 *   }
 * }
 */
export interface CountedSection {
    /**
     * Excel field that stores the count
     * Example: ClaimsCount, ConvictionsCount, AdditionalDriversCount
     */
    countField: ExcelColumnName;

    /**
     * Optional Excel field that enables/disables the section
     * Example: HadClaimsAnswer, HaveMotoringConvictions
     */
    enableField?: ExcelColumnName;

    /**
     * Optional extra Excel fields related to this counted section
     */
    extraFields?: ExcelColumnName[];

    /**
     * Nested canonical structure for this section
     */
    [key: string]:
    | ExcelColumnName
    | ExcelColumnName[]
    | FieldMapping
    | SchemaGroupMap
    | CountedSection
    | undefined;
}

/**
 * Nested schema object
 *
 * Supports:
 * - FieldMapping
 * - nested groups
 * - counted sections
 */
export interface SchemaGroupMap {
    [key: string]: FieldMapping | SchemaGroupMap | CountedSection;
}

/**
 * Repeated group such as additionalDrivers
 *
 * Example:
 * additionalDrivers -> AD1, AD2, AD3...
 */
export type RepeatedGroup = {
    /**
     * Excel field controlling how many repeated items exist
     */
    countField: ExcelColumnName;

    /**
     * Base prefix for repeated Excel fields
     * Example: AD -> AD1Firstname, AD2Firstname
     */
    prefixBase: string;

    /**
     * Maximum supported repeated items
     */
    max: number;

    /**
     * Canonical nested structure for each repeated item
     */
    groups: SchemaGroupMap;
};

export type RepeatedGroups = Record<string, RepeatedGroup>;

export type DataSchema = {
    /**
     * Excel sheet name
     */
    sheetName: string;

    /**
     * Output JSON file name
     */
    outputFile: string;

    /**
     * Canonical schema structure
     */
    groups: SchemaGroupMap;

    /**
     * Repeated structures (example: additionalDrivers)
     */
    repeatedGroups?: RepeatedGroups;

    /**
     * Required Excel columns
     */
    requiredFields?: ExcelColumnName[];

    /**
     * Optional Excel columns
     */
    optionalFields?: ExcelColumnName[];
};