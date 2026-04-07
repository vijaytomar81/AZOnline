// src/tools/pageObjects/validator/validate/rules/registry/indexExports/indexExportTypes.ts

import type { ValidationIssue } from "../../../types";

export type IndexExportExpectedState = {
    exportPathByPageKey: Map<string, string>;
    expectedPaths: Set<string>;
};

export type GroupedIndexExportIssues = {
    issues: ValidationIssue[];
    missingByPage: Map<string, string[]>;
    extraByPage: Map<string, string[]>;
};
