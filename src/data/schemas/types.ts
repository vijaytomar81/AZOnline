// src/data/input-data-schema/types.ts

export type ExcelColumnName = string;

/**
 * Canonical JSON key -> Excel field name
 *
 * Example:
 * {
 *   firstName: "FirstName",
 *   lastName: "LastName"
 * }
 */
export type FieldMapping = Record<string, ExcelColumnName>;

/**
 * Nested schema object
 *
 * Supports:
 * - direct field mappings
 * - nested groups
 */
export interface SchemaGroupMap {
    [key: string]: FieldMapping | SchemaGroupMap;
}

/**
 * Repeated group such as:
 * - additionalDrivers
 * - policyHolderClaims
 * - policyHolderConvictions
 * - additionalDriverClaims
 * - additionalDriverConvictions
 *
 * Example:
 * {
 *   countField: "AdditionalDriversCount",
 *   prefixBase: "AD",
 *   max: 5,
 *   groups: {
 *     identity: {
 *       firstName: "FirstName"
 *     }
 *   }
 * }
 */
export type RepeatedGroup = {
    /**
     * Excel field controlling how many repeated items exist
     */
    countField: ExcelColumnName;

    /**
     * Base prefix for repeated Excel fields
     * Example:
     * AD -> AD1FirstName, AD2FirstName
     * Claim -> Claim1Date, Claim2Date
     * Conviction -> Conviction1Code, Conviction2Code
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
     * Repeated structures
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