// src/toolingLayer/pageObjects/validator/validate/rules/registry/pageManager/pageManagerTypes.ts

import type { ValidationIssue } from "../../../types";

export type PageManagerExpectedState = {
    importByPage: Map<string, string>;
    keyIdByPage: Map<string, string>;
};

export type GroupedPageManagerIssues = {
    issues: ValidationIssue[];
    missingByPage: Map<string, string[]>;
    extraByPage: Map<string, string[]>;
};
