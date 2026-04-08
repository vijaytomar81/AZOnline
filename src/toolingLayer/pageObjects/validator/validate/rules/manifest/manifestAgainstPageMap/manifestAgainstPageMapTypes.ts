// src/toolingLayer/pageObjects/validator/validate/rules/manifest/manifestAgainstPageMap/manifestAgainstPageMapTypes.ts

import type { TreeNode } from "@utils/cliTree";
import type { ValidationIssue } from "../../../types";
import type { LoadedPageMap } from "@toolingLayer/pageObjects/common/readPageMap";

export type ManifestComparisonInputs = {
    pageMapItem: LoadedPageMap;
    manifestEntry: any;
    pageObjectsDir: string;
    manifestFile: string;
    ruleId: string;
};

export type ManifestComparisonResult = {
    issues: ValidationIssue[];
    reportNode?: TreeNode;
};

export type ExtraManifestIssueEntriesResult = {
    issues: ValidationIssue[];
    reportNodes: TreeNode[];
};
